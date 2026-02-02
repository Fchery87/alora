import { httpAction } from "../../_generated/server";
import { Webhook } from "svix";
import { internal } from "../../_generated/api";
import { requireRateLimit, createIpRateLimitKey } from "../../lib/ratelimit";

// Clerk webhook events we support
const SUPPORTED_EVENTS = [
  "user.created",
  "user.updated",
  "organization.created",
  "organization.updated",
  "organizationMembership.created",
  "user.deleted",
  "organization.deleted",
] as const;

export const clerk = httpAction(async (ctx: any, request: any) => {
  try {
    // Rate limit webhook requests by IP (60 per minute)
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = createIpRateLimitKey(clientIp, "webhook");

    try {
      await requireRateLimit(ctx, rateLimitKey, "webhook");
    } catch (rateError: any) {
      console.error("Webhook rate limit exceeded:", clientIp);
      return new Response("Rate limit exceeded", { status: 429 });
    }

    // Get Clerk webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", {
        status: 500,
      });
    }

    // Get SVIX headers for signature verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing SVIX headers");
      return new Response("Missing signature headers", {
        status: 400,
      });
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature using SVIX
    const wh = new Webhook(webhookSecret);
    let payload;

    try {
      payload = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as any;
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid signature", { status: 401 });
    }

    // Extract event data from verified payload
    const { type, data } = payload;

    // Verify this is a supported event type
    const eventType = type;
    console.log("Received webhook event:", eventType);

    if (!SUPPORTED_EVENTS.includes(eventType as any)) {
      console.log("Unsupported event type:", eventType);
      return new Response("Event received", { status: 200 });
    }

    // Route to appropriate handler
    let result: any;

    switch (eventType) {
      case "user.created":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleUserCreated,
          {
            clerkUserId: data.id,
            email: data.email_addresses?.[0]?.email_address,
            name:
              data.first_name || data.last_name
                ? `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim()
                : undefined,
            avatarUrl: data.profile_image_url,
          }
        );
        break;

      case "user.updated":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleUserUpdated,
          {
            clerkUserId: data.id,
            email: data.email_addresses?.[0]?.email_address,
            name:
              data.first_name || data.last_name
                ? `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim()
                : undefined,
            avatarUrl: data.profile_image_url,
          }
        );
        break;

      case "organization.created":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleOrganizationCreated,
          {
            clerkOrganizationId: data.id,
            organizationName: data.name,
          }
        );
        break;

      case "organization.updated":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleOrganizationUpdated,
          {
            clerkOrganizationId: data.id,
            organizationName: data.name,
          }
        );
        break;

      case "organizationMembership.created":
        if (!data.organization?.id || !data.public_user_data?.user_id) {
          console.error("Invalid organizationMembership payload:", {
            organizationId: data.organization?.id,
            userId: data.public_user_data?.user_id,
          });
          return new Response("Invalid membership payload", { status: 400 });
        }

        result = await ctx.runMutation(
          internal.functions.webhooks.handlers
            .handleOrganizationMembershipCreated,
          {
            clerkOrganizationId: data.organization.id,
            clerkUserId: data.public_user_data.user_id,
          }
        );
        break;

      case "user.deleted":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleUserDeleted,
          {
            clerkUserId: data.id,
          }
        );
        break;

      case "organization.deleted":
        result = await ctx.runMutation(
          internal.functions.webhooks.handlers.handleOrganizationDeleted,
          { clerkOrganizationId: data.id }
        );
        break;

      default:
        result = { status: "unknown_event" };
    }

    console.log("Webhook handled:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
});

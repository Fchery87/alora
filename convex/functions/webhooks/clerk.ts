import { httpAction } from "../../_generated/server";
import { v } from "convex/values";
import { Webhook } from "svix";
import {
  handleUserCreated,
  handleOrganizationCreated,
  handleOrganizationMembershipCreated,
  handleUserDeleted,
  handleOrganizationDeleted,
} from "./handlers";

// Clerk webhook events we support
const SUPPORTED_EVENTS = [
  "user.created",
  "organization.created",
  "organizationMembership.created",
  "user.deleted",
  "organization.deleted",
] as const;

export const clerk = httpAction(async (ctx: any, request: any) => {
  try {
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

    // Reconstruct event object from verified payload for handlers
    const event = { type, data };

    switch (eventType) {
      case "user.created":
        result = await handleUserCreated(ctx, event);
        break;

      case "organization.created":
        result = await handleOrganizationCreated(ctx, event);
        break;

      case "organizationMembership.created":
        result = await handleOrganizationMembershipCreated(ctx, event);
        break;

      case "user.deleted":
        result = await handleUserDeleted(ctx, event);
        break;

      case "organization.deleted":
        result = await handleOrganizationDeleted(ctx, event);
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

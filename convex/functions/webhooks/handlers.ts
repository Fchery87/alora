import type { Doc } from "../../_generated/dataModel";
import { v } from "convex/values";

/**
 * Handle user.created event from Clerk
 */
export async function handleUserCreated(ctx: any, event: any) {
  const clerkUserId = event.data.id;
  const email = event.data.email_addresses?.[0]?.email_address;
  const firstName = event.data.first_name;
  const lastName = event.data.last_name;
  const name = firstName || lastName ? `${firstName} ${lastName}`.trim() : undefined;
  const avatarUrl = event.data.profile_image_url;
  const now = Date.now();

  // Check if user already exists
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
    .first();

  if (existingUser) {
    console.log("User already exists:", clerkUserId);
    return { status: "existing" };
  }

  // Create new user
  const userId = await ctx.db.insert("users", {
    clerkUserId,
    email,
    name,
    avatarUrl,
    createdAt: now,
    lastActiveAt: now,
  });

  console.log("Created user:", userId, "for Clerk user:", clerkUserId);

  return {
    status: "created",
    userId,
    clerkUserId,
  };
}

/**
 * Handle organization.created event from Clerk
 */
export async function handleOrganizationCreated(ctx: any, event: any) {
  const clerkOrganizationId = event.data.id;
  const organizationName = event.data.name;
  const now = Date.now();

  // Check if family already exists
  const existingFamily = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) => q.eq("clerkOrganizationId", clerkOrganizationId))
    .first();

  if (existingFamily) {
    console.log("Family already exists:", clerkOrganizationId);
    return { status: "existing" };
  }

  // Create new family
  const familyId = await ctx.db.insert("families", {
    clerkOrganizationId,
    name: organizationName,
    createdAt: now,
    settings: {
      premiumPlan: "free",
    },
  });

  console.log("Created family:", familyId, "for Clerk org:", clerkOrganizationId);

  return {
    status: "created",
    familyId,
    clerkOrganizationId,
  };
}

/**
 * Handle organizationMembership.created event from Clerk
 */
export async function handleOrganizationMembershipCreated(
  ctx: any,
  event: any
) {
  const clerkOrganizationId = event.data.organization.id;
  const clerkUserId = event.data.public_user_data.user_id;

  console.log("Organization membership created:", {
    org: clerkOrganizationId,
    user: clerkUserId,
  });

  // Verify user and family exist
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
    .first();

  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) => q.eq("clerkOrganizationId", clerkOrganizationId))
    .first();

  if (!user || !family) {
    console.log("User or family not found, skipping sync");
    return { status: "not_found" };
  }

  // Update user's last active timestamp
  await ctx.db.patch(user._id, {
    lastActiveAt: Date.now(),
  });

  console.log("Synced organization membership for user:", user._id, "to family:", family._id);

  return {
    status: "synced",
    userId: user._id,
    familyId: family._id,
  };
}

/**
 * Handle user.deleted event from Clerk
 */
export async function handleUserDeleted(ctx: any, event: any) {
  const clerkUserId = event.data.id;

  // Find user
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
    .first();

  if (!user) {
    console.log("User not found for deletion:", clerkUserId);
    return { status: "not_found" };
  }

  // Note: We don't delete the user record to preserve historical data
  // In production, you might want to anonymize or soft-delete
  console.log("User deleted (Clerk):", clerkUserId, "Convex user:", user._id);

  return {
    status: "deleted",
    userId: user._id,
    clerkUserId,
  };
}

/**
 * Handle organization.deleted event from Clerk
 */
export async function handleOrganizationDeleted(ctx: any, event: any) {
  const clerkOrganizationId = event.data.id;

  // Find family
  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) => q.eq("clerkOrganizationId", clerkOrganizationId))
    .first();

  if (!family) {
    console.log("Family not found for deletion:", clerkOrganizationId);
    return { status: "not_found" };
  }

  // Note: We don't delete the family record to preserve historical data
  console.log("Organization deleted (Clerk):", clerkOrganizationId, "Convex family:", family._id);

  return {
    status: "deleted",
    familyId: family._id,
    clerkOrganizationId,
  };
}

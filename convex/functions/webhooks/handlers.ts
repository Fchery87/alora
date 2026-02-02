import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";

const shouldLog = process.env.NODE_ENV !== "test" && !process.env.VITEST;
function log(...args: any[]) {
  if (shouldLog) console.log(...args);
}

function assertNonEmptyString(value: unknown, name: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} is required`);
  }
}

/**
 * Handle user.created event from Clerk
 */
export const handleUserCreated = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: handleUserCreatedHandler,
});

export async function handleUserCreatedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkUserId, "clerkUserId");

  const now = Date.now();

  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) =>
      q.eq("clerkUserId", args.clerkUserId)
    )
    .first();

  if (existingUser) {
    log("User already exists:", args.clerkUserId);
    return { status: "existing" };
  }

  const userId = await ctx.db.insert("users", {
    clerkUserId: args.clerkUserId,
    email: args.email ?? "unknown@local",
    name: args.name,
    avatarUrl: args.avatarUrl,
    createdAt: now,
    lastActiveAt: now,
  });

  log("Created user:", userId, "for Clerk user:", args.clerkUserId);

  return { status: "created", userId, clerkUserId: args.clerkUserId };
}

/**
 * Handle organization.created event from Clerk
 */
export const handleOrganizationCreated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    organizationName: v.optional(v.string()),
  },
  handler: handleOrganizationCreatedHandler,
});

export async function handleOrganizationCreatedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkOrganizationId, "clerkOrganizationId");

  const now = Date.now();
  const orgId = args.clerkOrganizationId;

  const existingFamily = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) =>
      q.eq("clerkOrganizationId", orgId)
    )
    .first();

  if (existingFamily) {
    log("Family already exists:", orgId);
    return { status: "existing" };
  }

  const familyId = await ctx.db.insert("families", {
    clerkOrganizationId: orgId,
    name: args.organizationName,
    createdAt: now,
    settings: {
      premiumPlan: "free",
    },
  });

  log("Created family:", familyId, "for Clerk org:", orgId);

  return { status: "created", familyId, clerkOrganizationId: orgId };
}

/**
 * Handle organizationMembership.created event from Clerk
 */
export const handleOrganizationMembershipCreated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    clerkUserId: v.string(),
  },
  handler: handleOrganizationMembershipCreatedHandler,
});

export async function handleOrganizationMembershipCreatedHandler(
  ctx: any,
  args: any
) {
  assertNonEmptyString(args?.clerkOrganizationId, "clerkOrganizationId");
  assertNonEmptyString(args?.clerkUserId, "clerkUserId");

  const orgId = args.clerkOrganizationId;
  const clerkUserId = args.clerkUserId;

  log("Organization membership created:", { org: orgId, user: clerkUserId });

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
    .first();

  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) =>
      q.eq("clerkOrganizationId", orgId)
    )
    .first();

  if (!user || !family) {
    log("User or family not found, skipping sync");
    return { status: "not_found" };
  }

  await ctx.db.patch(user._id, {
    lastActiveAt: Date.now(),
    clerkOrganizationId: orgId,
  });

  log(
    "Synced organization membership for user:",
    user._id,
    "to family:",
    family._id
  );

  return { status: "synced", userId: user._id, familyId: family._id };
}

/**
 * Handle user.deleted event from Clerk
 */
export const handleUserDeleted = internalMutation({
  args: { clerkUserId: v.string() },
  handler: handleUserDeletedHandler,
});

export async function handleUserDeletedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkUserId, "clerkUserId");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) =>
      q.eq("clerkUserId", args.clerkUserId)
    )
    .first();

  if (!user) {
    log("User not found for deletion:", args.clerkUserId);
    return { status: "not_found" };
  }

  log("User deleted (Clerk):", args.clerkUserId, "Convex user:", user._id);

  return { status: "deleted", userId: user._id, clerkUserId: args.clerkUserId };
}

/**
 * Handle organization.deleted event from Clerk
 */
export const handleOrganizationDeleted = internalMutation({
  args: { clerkOrganizationId: v.string() },
  handler: handleOrganizationDeletedHandler,
});

export async function handleOrganizationDeletedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkOrganizationId, "clerkOrganizationId");

  const orgId = args.clerkOrganizationId;
  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) =>
      q.eq("clerkOrganizationId", orgId)
    )
    .first();

  if (!family) {
    log("Family not found for deletion:", orgId);
    return { status: "not_found" };
  }

  log("Organization deleted (Clerk):", orgId, "Convex family:", family._id);

  return {
    status: "deleted",
    familyId: family._id,
    clerkOrganizationId: orgId,
  };
}

export const handleUserUpdated = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: handleUserUpdatedHandler,
});

export async function handleUserUpdatedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkUserId, "clerkUserId");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) =>
      q.eq("clerkUserId", args.clerkUserId)
    )
    .first();

  if (!user) {
    log("User not found for update:", args.clerkUserId);
    return { status: "not_found" };
  }

  await ctx.db.patch(user._id, {
    email: args.email ?? user.email,
    name: args.name ?? user.name,
    avatarUrl: args.avatarUrl ?? user.avatarUrl,
    lastActiveAt: Date.now(),
  });

  return { status: "updated", userId: user._id, clerkUserId: args.clerkUserId };
}

export const handleOrganizationUpdated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    organizationName: v.optional(v.string()),
  },
  handler: handleOrganizationUpdatedHandler,
});

export async function handleOrganizationUpdatedHandler(ctx: any, args: any) {
  assertNonEmptyString(args?.clerkOrganizationId, "clerkOrganizationId");

  const orgId = args.clerkOrganizationId;
  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) =>
      q.eq("clerkOrganizationId", orgId)
    )
    .first();

  if (!family) {
    log("Family not found for update:", orgId);
    return { status: "not_found" };
  }

  await ctx.db.patch(family._id, {
    name: args.organizationName ?? family.name,
  });

  return {
    status: "updated",
    familyId: family._id,
    clerkOrganizationId: orgId,
  };
}

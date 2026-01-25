import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";

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
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .first();

    if (existingUser) {
      console.log("User already exists:", args.clerkUserId);
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

    console.log("Created user:", userId, "for Clerk user:", args.clerkUserId);

    return { status: "created", userId, clerkUserId: args.clerkUserId };
  },
});

/**
 * Handle organization.created event from Clerk
 */
export const handleOrganizationCreated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    organizationName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingFamily = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (existingFamily) {
      console.log("Family already exists:", args.clerkOrganizationId);
      return { status: "existing" };
    }

    const familyId = await ctx.db.insert("families", {
      clerkOrganizationId: args.clerkOrganizationId,
      name: args.organizationName,
      createdAt: now,
      settings: {
        premiumPlan: "free",
      },
    });

    console.log(
      "Created family:",
      familyId,
      "for Clerk org:",
      args.clerkOrganizationId
    );

    return {
      status: "created",
      familyId,
      clerkOrganizationId: args.clerkOrganizationId,
    };
  },
});

/**
 * Handle organizationMembership.created event from Clerk
 */
export const handleOrganizationMembershipCreated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Organization membership created:", {
      org: args.clerkOrganizationId,
      user: args.clerkUserId,
    });

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .first();

    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (!user || !family) {
      console.log("User or family not found, skipping sync");
      return { status: "not_found" };
    }

    await ctx.db.patch(user._id, {
      lastActiveAt: Date.now(),
      clerkOrganizationId: args.clerkOrganizationId,
    });

    console.log(
      "Synced organization membership for user:",
      user._id,
      "to family:",
      family._id
    );

    return { status: "synced", userId: user._id, familyId: family._id };
  },
});

/**
 * Handle user.deleted event from Clerk
 */
export const handleUserDeleted = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .first();

    if (!user) {
      console.log("User not found for deletion:", args.clerkUserId);
      return { status: "not_found" };
    }

    console.log(
      "User deleted (Clerk):",
      args.clerkUserId,
      "Convex user:",
      user._id
    );

    return {
      status: "deleted",
      userId: user._id,
      clerkUserId: args.clerkUserId,
    };
  },
});

/**
 * Handle organization.deleted event from Clerk
 */
export const handleOrganizationDeleted = internalMutation({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, args) => {
    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (!family) {
      console.log("Family not found for deletion:", args.clerkOrganizationId);
      return { status: "not_found" };
    }

    console.log(
      "Organization deleted (Clerk):",
      args.clerkOrganizationId,
      "Convex family:",
      family._id
    );

    return {
      status: "deleted",
      familyId: family._id,
      clerkOrganizationId: args.clerkOrganizationId,
    };
  },
});

export const handleUserUpdated = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .first();

    if (!user) {
      console.log("User not found for update:", args.clerkUserId);
      return { status: "not_found" };
    }

    await ctx.db.patch(user._id, {
      email: args.email ?? user.email,
      name: args.name ?? user.name,
      avatarUrl: args.avatarUrl ?? user.avatarUrl,
      lastActiveAt: Date.now(),
    });

    return {
      status: "updated",
      userId: user._id,
      clerkUserId: args.clerkUserId,
    };
  },
});

export const handleOrganizationUpdated = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    organizationName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (!family) {
      console.log("Family not found for update:", args.clerkOrganizationId);
      return { status: "not_found" };
    }

    await ctx.db.patch(family._id, {
      name: args.organizationName ?? family.name,
    });

    return {
      status: "updated",
      familyId: family._id,
      clerkOrganizationId: args.clerkOrganizationId,
    };
  },
});

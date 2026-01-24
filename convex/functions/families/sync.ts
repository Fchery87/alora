import { mutation } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Sync family/organization data from Clerk to Convex
 */
export const sync = mutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkOrganizationId, name } = args;

    // Check if family already exists
    const existingFamily = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", clerkOrganizationId)
      )
      .first();

    if (existingFamily) {
      // Update existing family
      const updated = await ctx.db.patch(existingFamily._id, {
        name: name || existingFamily.name,
      });

      console.log("Synced existing family:", existingFamily._id);
      return {
        action: "updated",
        familyId: existingFamily._id,
        clerkOrganizationId,
      };
    }

    // Create new family
    const familyId = await ctx.db.insert("families", {
      clerkOrganizationId,
      name,
      createdAt: Date.now(),
      settings: {
        premiumPlan: "free",
      },
    });

    console.log("Synced new family:", familyId);
    return {
      action: "created",
      familyId,
      clerkOrganizationId,
    };
  },
});

/**
 * Update family settings
 */
export const updateSettings = mutation({
  args: {
    clerkOrganizationId: v.string(),
    settings: v.object({
      premiumPlan: v.union(v.literal("free"), v.literal("premium")),
      premiumExpiry: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (!family) {
      throw new Error("Family not found");
    }

    await ctx.db.patch(family._id, {
      settings: args.settings,
    });

    console.log("Updated family settings:", family._id);
    return {
      status: "updated",
      familyId: family._id,
    };
  },
});

/**
 * Get family by Clerk organization ID
 */
export const getByClerkOrganizationId = mutation({
  args: {
    clerkOrganizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .first();

    if (!family) {
      return null;
    }

    return family;
  },
});

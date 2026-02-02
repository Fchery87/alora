import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireUserId, requireOrganizationId } from "../../lib/users";

export const get = query({
  args: { id: v.id("families") },
  handler: async (ctx, args) => {
    await requireUserId(ctx);

    const family = await ctx.db.get(args.id);
    if (!family) throw new Error("Family not found");

    // Verify user can access this family via organization
    const userOrgId = await requireOrganizationId(ctx);
    if (family.clerkOrganizationId !== userOrgId) {
      throw new Error("Not authorized to view this family");
    }

    return family;
  },
});

export const getByClerkOrganizationId = query({
  args: { clerkOrganizationId: v.string() },
  handler: getByClerkOrganizationIdHandler,
});

export async function getByClerkOrganizationIdHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);

  if (userOrgId !== args.clerkOrganizationId) {
    throw new Error("Not authorized to view this organization");
  }

  const family = await ctx.db
    .query("families")
    .withIndex("by_clerk_org_id", (q: any) =>
      q.eq("clerkOrganizationId", userOrgId)
    )
    .first();
  return family;
}

export const sync = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const existingFamily = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", userOrgId)
      )
      .first();

    if (existingFamily) {
      await ctx.db.patch(existingFamily._id, {
        name: args.name || existingFamily.name,
      });
      return { action: "updated", familyId: existingFamily._id };
    }

    const familyId = await ctx.db.insert("families", {
      clerkOrganizationId: userOrgId,
      name: args.name,
      createdAt: Date.now(),
      settings: {
        premiumPlan: "free",
      },
    });

    return { action: "created", familyId };
  },
});

export const updateSettings = mutation({
  args: {
    settings: v.object({
      premiumPlan: v.union(v.literal("free"), v.literal("premium")),
      premiumExpiry: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org_id", (q) =>
        q.eq("clerkOrganizationId", userOrgId)
      )
      .first();

    if (!family) {
      throw new Error("Family not found");
    }

    await ctx.db.patch(family._id, {
      settings: args.settings,
    });

    return { status: "updated", familyId: family._id };
  },
});

import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";
import { requireOrganizationId, requireBabyAccess } from "../../lib/users";

/**
 * Get all babies for the current user's organization
 */
export const listByOrganization = query({
  args: {},
  handler: async (ctx) => {
    const orgId = await requireOrganizationId(ctx);
    const babies = await ctx.db
      .query("babies")
      .withIndex("by_family", (q) => q.eq("clerkOrganizationId", orgId as string))
      .collect();

    return babies;
  },
});

/**
 * Get a specific baby by ID
 */
export const getById = query({
  args: {
    id: v.id("babies"),
  },
  handler: async (ctx, args) => {
    await requireBabyAccess(ctx, args.id);
    const baby = await ctx.db.get(args.id);
    return baby;
  },
});

/**
 * Create a new baby
 */
export const create = mutation({
  args: {
    name: v.string(),
    birthDate: v.number(),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"))
    ),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orgId = await requireOrganizationId(ctx);
    const babyId = await ctx.db.insert("babies", {
      clerkOrganizationId: orgId as string,
      name: args.name,
      birthDate: args.birthDate,
      gender: args.gender,
      photoUrl: args.photoUrl,
      createdAt: Date.now(),
    });

    return babyId;
  },
});

/**
 * Update an existing baby
 */
export const update = mutation({
  args: {
    id: v.id("babies"),
    name: v.optional(v.string()),
    birthDate: v.optional(v.number()),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"))
    ),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Verify baby exists and user has access
    await requireBabyAccess(ctx, id);

    // Update only provided fields
    await ctx.db.patch(id, updateData);

    return id;
  },
});

/**
 * Delete a baby
 */
export const remove = mutation({
  args: {
    id: v.id("babies"),
  },
  handler: async (ctx, args) => {
    await requireBabyAccess(ctx, args.id);
    await ctx.db.delete(args.id);
  },
});

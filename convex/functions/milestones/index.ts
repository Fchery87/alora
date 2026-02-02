import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import { requireUserId, requireBabyAccess } from "../../lib/users";
import {
  sanitizeTitle,
  sanitizeDescription,
  sanitizeText,
} from "../../lib/sanitize";

export const list = query({
  args: {
    babyId: v.id("babies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    const milestones = await ctx.db
      .query("milestones")
      .withIndex("by_baby", (q) => q.eq("babyId", args.babyId))
      .order("desc")
      .take(args.limit || 50);

    return milestones;
  },
});

export const get = query({
  args: {
    id: v.id("milestones"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(args.id);
    if (!milestone) throw new Error("Milestone not found");

    // Verify user has access to this baby's milestones
    await requireBabyAccess(ctx, milestone.babyId);

    return milestone;
  },
});

export const create = mutation({
  args: {
    babyId: v.id("babies"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("motor"),
      v.literal("cognitive"),
      v.literal("language"),
      v.literal("social"),
      v.literal("custom")
    ),
    date: v.optional(v.string()),
    ageMonths: v.optional(v.number()),
    isCustom: v.boolean(),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("milestones", {
      ...args,
      title: sanitizeTitle(args.title),
      description: sanitizeDescription(args.description),
      photoUrl: args.photoUrl ? sanitizeText(args.photoUrl) : undefined,
      isCelebrated: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("milestones"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("motor"),
        v.literal("cognitive"),
        v.literal("language"),
        v.literal("social"),
        v.literal("custom")
      )
    ),
    date: v.optional(v.string()),
    ageMonths: v.optional(v.number()),
    photoUrl: v.optional(v.string()),
    isCelebrated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, existing.babyId);

    return await ctx.db.patch(id, {
      ...updates,
      title: updates.title ? sanitizeTitle(updates.title) : undefined,
      description: updates.description
        ? sanitizeDescription(updates.description)
        : undefined,
      photoUrl: updates.photoUrl ? sanitizeText(updates.photoUrl) : undefined,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("milestones"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(args.id);
    if (!milestone) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, milestone.babyId);

    return await ctx.db.delete(args.id);
  },
});

export const celebrate = mutation({
  args: {
    id: v.id("milestones"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(args.id);
    if (!milestone) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, milestone.babyId);

    return await ctx.db.patch(args.id, {
      isCelebrated: true,
    });
  },
});

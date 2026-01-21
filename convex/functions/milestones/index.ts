import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireUserId,
} from "../../lib/users";

export const list = query({
  args: { babyId: v.id("babies") },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);
    const milestones = await ctx.db
      .query("milestones")
      .withIndex("by_baby", (q) => q.eq("babyId", args.babyId))
      .collect();
    return milestones.sort((a, b) => {
      if (a.date && b.date)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.ageMonths && b.ageMonths) return b.ageMonths - a.ageMonths;
      return 0;
    });
  },
});

export const get = query({
  args: { id: v.id("milestones") },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const milestone = await ctx.db.get(args.id);
    if (!milestone) {
      return null;
    }
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
    await requireMutationUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);
    const milestoneId = await ctx.db.insert("milestones", {
      babyId: args.babyId,
      title: args.title,
      description: args.description,
      category: args.category,
      date: args.date,
      ageMonths: args.ageMonths,
      isCustom: args.isCustom,
      isCelebrated: false,
      photoUrl: args.photoUrl,
    });
    return milestoneId;
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
  },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Milestone not found");
    await requireBabyAccess(ctx, existing.babyId);
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Milestone not found");
    await requireBabyAccess(ctx, existing.babyId);
    await ctx.db.delete(args.id);
  },
});

export const celebrate = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Milestone not found");
    await requireBabyAccess(ctx, existing.babyId);
    await ctx.db.patch(args.id, { isCelebrated: true });
  },
});

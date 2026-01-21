import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireUserId,
} from "../../lib/users";

export const createDiaper = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(
      v.literal("wet"),
      v.literal("solid"),
      v.literal("both"),
      v.literal("mixed")
    ),
    color: v.optional(
      v.union(
        v.literal("yellow"),
        v.literal("orange"),
        v.literal("green"),
        v.literal("brown"),
        v.literal("red")
      )
    ),
    notes: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const createdById = await requireMutationUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("diapers", {
      ...args,
      createdById,
    });
  },
});

export const listDiapers = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    let diapers = await ctx.db
      .query("diapers")
      .withIndex("by_baby_and_time", (q) => q.eq("babyId", args.babyId))
      .order("desc")
      .take(args.limit || 100);

    if (args.startDate && args.endDate) {
      diapers = diapers.filter(
        (diaper) =>
          diaper.startTime >= args.startDate! &&
          diaper.startTime <= args.endDate!
      );
    }

    return diapers.filter((diaper) => diaper.createdById === userId);
  },
});

export const getDiaper = query({
  args: {
    id: v.id("diapers"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const diaper = await ctx.db.get(args.id);
    if (!diaper) {
      return null;
    }
    if (diaper.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, diaper.babyId);
    return diaper;
  },
});

export const updateDiaper = mutation({
  args: {
    id: v.id("diapers"),
    type: v.optional(
      v.union(
        v.literal("wet"),
        v.literal("solid"),
        v.literal("both"),
        v.literal("mixed")
      )
    ),
    color: v.optional(
      v.union(
        v.literal("yellow"),
        v.literal("orange"),
        v.literal("green"),
        v.literal("brown"),
        v.literal("red")
      )
    ),
    endTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);

    const existingDiaper = await ctx.db.get(args.id);

    if (!existingDiaper) {
      throw new Error("Diaper not found");
    }
    if (existingDiaper.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, existingDiaper.babyId);

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteDiaper = mutation({
  args: {
    id: v.id("diapers"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existingDiaper = await ctx.db.get(args.id);
    if (!existingDiaper) {
      throw new Error("Diaper not found");
    }
    if (existingDiaper.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, existingDiaper.babyId);
    return await ctx.db.delete(args.id);
  },
});

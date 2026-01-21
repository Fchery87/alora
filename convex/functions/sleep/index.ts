import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireUserId,
} from "../../lib/users";

export const createSleep = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(v.literal("nap"), v.literal("night"), v.literal("day")),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    quality: v.union(
      v.literal("awake"),
      v.literal("drowsy"),
      v.literal("sleeping"),
      v.literal("deep"),
      v.literal("awake")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const createdById = await requireMutationUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("sleep", {
      ...args,
      createdById,
    });
  },
});

export const listSleep = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    let sleepRecords = await ctx.db
      .query("sleep")
      .withIndex("by_baby_and_time", (q) => q.eq("babyId", args.babyId))
      .order("desc")
      .take(args.limit || 100);

    if (args.startDate && args.endDate) {
      sleepRecords = sleepRecords.filter(
        (record) =>
          record.startTime >= args.startDate! &&
          record.startTime <= args.endDate!
      );
    }

    return sleepRecords.filter((record) => record.createdById === userId);
  },
});

export const getSleep = query({
  args: {
    id: v.id("sleep"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const record = await ctx.db.get(args.id);
    if (!record) {
      return null;
    }
    if (record.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, record.babyId);
    return record;
  },
});

export const updateSleep = mutation({
  args: {
    id: v.id("sleep"),
    type: v.optional(
      v.union(v.literal("nap"), v.literal("night"), v.literal("day"))
    ),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    quality: v.optional(
      v.union(
        v.literal("awake"),
        v.literal("drowsy"),
        v.literal("sleeping"),
        v.literal("deep"),
        v.literal("awake")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);

    const existingSleep = await ctx.db.get(args.id);

    if (!existingSleep) {
      throw new Error("Sleep record not found");
    }
    if (existingSleep.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, existingSleep.babyId);

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteSleep = mutation({
  args: {
    id: v.id("sleep"),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    const existingSleep = await ctx.db.get(args.id);
    if (!existingSleep) {
      throw new Error("Sleep record not found");
    }
    if (existingSleep.createdById !== userId) {
      throw new Error("Not authorized");
    }
    await requireBabyAccess(ctx, existingSleep.babyId);
    return await ctx.db.delete(args.id);
  },
});

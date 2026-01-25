import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireUserId,
} from "../../lib/users";

export const createFeed = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(
      v.literal("breast"),
      v.literal("formula"),
      v.literal("solid")
    ),
    side: v.optional(
      v.union(v.literal("left"), v.literal("right"), v.literal("both"))
    ),
    amount: v.optional(v.string()),
    duration: v.optional(v.number()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const createdById = await requireMutationUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("feeds", {
      ...args,
      createdById,
    });
  },
});

export const listFeeds = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    let feeds = await ctx.db
      .query("feeds")
      .withIndex("by_baby_and_time", (q) => q.eq("babyId", args.babyId))
      .order("desc")
      .take(args.limit || 100);

    if (args.startDate && args.endDate) {
      feeds = feeds.filter(
        (feed) =>
          feed.startTime >= args.startDate! && feed.startTime <= args.endDate!
      );
    }

    return feeds;
  },
});

export const getFeed = query({
  args: {
    id: v.id("feeds"),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const feed = await ctx.db.get(args.id);
    if (!feed) {
      return null;
    }
    await requireBabyAccess(ctx, feed.babyId);
    return feed;
  },
});

export const updateFeed = mutation({
  args: {
    id: v.id("feeds"),
    type: v.optional(
      v.union(v.literal("breast"), v.literal("formula"), v.literal("solid"))
    ),
    side: v.optional(
      v.union(v.literal("left"), v.literal("right"), v.literal("both"))
    ),
    amount: v.optional(v.string()),
    duration: v.optional(v.number()),
    endTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);

    const existingFeed = await ctx.db.get(args.id);

    if (!existingFeed) {
      throw new Error("Feed not found");
    }
    await requireBabyAccess(ctx, existingFeed.babyId);
    if (existingFeed.createdById !== userId) {
      throw new Error("Only the creator can edit this feed");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteFeed = mutation({
  args: {
    id: v.id("feeds"),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    const existingFeed = await ctx.db.get(args.id);
    if (!existingFeed) {
      throw new Error("Feed not found");
    }
    await requireBabyAccess(ctx, existingFeed.babyId);
    if (existingFeed.createdById !== userId) {
      throw new Error("Only creator can delete this feed");
    }
    return await ctx.db.delete(args.id);
  },
});

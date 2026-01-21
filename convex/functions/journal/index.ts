import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import { requireMutationUserId, requireUserId } from "../../lib/users";

export const createJournal = mutation({
  args: {
    title: v.optional(v.string()),
    content: v.string(),
    mood: v.optional(
      v.union(
        v.literal("great"),
        v.literal("good"),
        v.literal("okay"),
        v.literal("low"),
        v.literal("struggling")
      )
    ),
    tags: v.optional(v.array(v.string())),
    babyId: v.optional(v.id("babies")),
    isGratitude: v.optional(v.boolean()),
    isWin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("journal", {
      ...args,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listJournal = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);

    let entries = await ctx.db
      .query("journal")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 50);

    if (args.startDate && args.endDate) {
      entries = entries.filter(
        (entry) =>
          entry.createdAt >= args.startDate! && entry.createdAt <= args.endDate!
      );
    }

    if (args.tags && args.tags.length > 0) {
      entries = entries.filter((entry) =>
        entry.tags?.some((tag) => args.tags!.includes(tag))
      );
    }

    return entries;
  },
});

export const getJournal = query({
  args: {
    id: v.id("journal"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      return null;
    }
    if (entry.userId !== userId) {
      throw new Error("Not authorized");
    }
    return entry;
  },
});

export const updateJournal = mutation({
  args: {
    id: v.id("journal"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    mood: v.optional(
      v.union(
        v.literal("great"),
        v.literal("good"),
        v.literal("okay"),
        v.literal("low"),
        v.literal("struggling")
      )
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new Error("Journal entry not found");
    }
    if (existing.userId !== userId) {
      throw new Error("Not authorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteJournal = mutation({
  args: {
    id: v.id("journal"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Journal entry not found");
    }
    if (existing.userId !== userId) {
      throw new Error("Not authorized");
    }
    return await ctx.db.delete(args.id);
  },
});

import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import { requireMutationUserId, requireUserId } from "../../lib/users";

export const createMood = mutation({
  args: {
    babyId: v.optional(v.id("babies")),
    mood: v.union(
      v.literal("great"),
      v.literal("good"),
      v.literal("okay"),
      v.literal("low"),
      v.literal("struggling")
    ),
    energy: v.optional(
      v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
    ),
    anxiety: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("moodCheckIns", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const listMood = query({
  args: {
    babyId: v.optional(v.id("babies")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);

    let moodCheckIns = await ctx.db
      .query("moodCheckIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 100);

    if (args.startDate && args.endDate) {
      moodCheckIns = moodCheckIns.filter(
        (checkIn) =>
          checkIn.createdAt >= args.startDate! &&
          checkIn.createdAt <= args.endDate!
      );
    }

    return moodCheckIns;
  },
});

export const getMood = query({
  args: {
    id: v.id("moodCheckIns"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const record = await ctx.db.get(args.id);
    if (!record) {
      return null;
    }
    if (record.userId !== userId) {
      throw new Error("Not authorized");
    }
    return record;
  },
});

export const getMoodTrends = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const days = args.days || 7;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const moodCheckIns = await ctx.db
      .query("moodCheckIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gt(q.field("createdAt"), startDate))
      .collect();

    const moodCounts: Record<string, number> = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      struggling: 0,
    };

    moodCheckIns.forEach((checkIn) => {
      moodCounts[checkIn.mood]++;
    });

    return {
      total: moodCheckIns.length,
      moodCounts,
      average:
        moodCheckIns.length > 0
          ? moodCheckIns.reduce((sum, c) => sum + getMoodScore(c.mood), 0) /
            moodCheckIns.length
          : null,
    };
  },
});

function getMoodScore(
  mood: "great" | "good" | "okay" | "low" | "struggling"
): number {
  const scores: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    low: 2,
    struggling: 1,
  };
  return scores[mood] || 0;
}

export const deleteMood = mutation({
  args: {
    id: v.id("moodCheckIns"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const record = await ctx.db.get(args.id);
    if (!record) {
      throw new Error("Mood check-in not found");
    }
    if (record.userId !== userId) {
      throw new Error("Not authorized");
    }
    return await ctx.db.delete(args.id);
  },
});

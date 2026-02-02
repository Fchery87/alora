import { mutation } from "../../_generated/server";
import { RETENTION_PERIODS, getRetentionCutoff } from "../../lib/retention";

/**
 * Cleanup old feed records (older than 1 year)
 */
export const cleanupOldFeeds = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    let deletedCount = 0;

    // Get all feeds older than retention period
    const oldFeeds = await ctx.db
      .query("feeds")
      .withIndex("by_time", (q: any) => q.lt("startTime", cutoff))
      .collect();

    // Delete them
    for (const feed of oldFeeds) {
      await ctx.db.delete(feed._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old feed records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old diaper records (older than 1 year)
 */
export const cleanupOldDiapers = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    let deletedCount = 0;

    const oldDiapers = await ctx.db
      .query("diapers")
      .withIndex("by_time", (q: any) => q.lt("startTime", cutoff))
      .collect();

    for (const diaper of oldDiapers) {
      await ctx.db.delete(diaper._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old diaper records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old sleep records (older than 1 year)
 */
export const cleanupOldSleep = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    let deletedCount = 0;

    const oldSleep = await ctx.db
      .query("sleep")
      .withIndex("by_time", (q: any) => q.lt("startTime", cutoff))
      .collect();

    for (const record of oldSleep) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old sleep records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old growth records (older than 1 year)
 */
export const cleanupOldGrowth = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    const cutoffDate = new Date(cutoff).toISOString().split("T")[0];
    let deletedCount = 0;

    // Growth records use date string, not timestamp
    const allGrowth = await ctx.db.query("growth").collect();
    const oldGrowth = allGrowth.filter((g: any) => g.date < cutoffDate);

    for (const record of oldGrowth) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old growth records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old milestone records (older than 1 year)
 */
export const cleanupOldMilestones = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    const cutoffDate = new Date(cutoff).toISOString().split("T")[0];
    let deletedCount = 0;

    const allMilestones = await ctx.db.query("milestones").collect();
    const oldMilestones = allMilestones.filter(
      (m: any) => m.date && m.date < cutoffDate
    );

    for (const record of oldMilestones) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old milestone records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old mood check-ins (older than 1 year)
 */
export const cleanupOldMoodCheckIns = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    let deletedCount = 0;

    // Mood check-ins use createdAt timestamp
    const allMoodCheckIns = await ctx.db.query("moodCheckIns").collect();
    const oldMoodCheckIns = allMoodCheckIns.filter(
      (m: any) => m.createdAt < cutoff
    );

    for (const record of oldMoodCheckIns) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old mood check-in records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup old journal entries (older than 1 year)
 */
export const cleanupOldJournal = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.ACTIVITY_LOGS);
    let deletedCount = 0;

    const allJournal = await ctx.db.query("journal").collect();
    const oldJournal = allJournal.filter((j: any) => j.createdAt < cutoff);

    for (const record of oldJournal) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old journal records`);
    }

    return deletedCount;
  },
});

/**
 * Cleanup expired rate limit entries (older than 24 hours)
 */
export const cleanupExpiredRateLimits = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = getRetentionCutoff(RETENTION_PERIODS.RATE_LIMITS);
    let deletedCount = 0;

    const expiredRateLimits = await ctx.db
      .query("rateLimits")
      .withIndex("by_reset", (q: any) => q.lt("resetAt", cutoff))
      .collect();

    for (const record of expiredRateLimits) {
      await ctx.db.delete(record._id);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} expired rate limit records`);
    }

    return deletedCount;
  },
});

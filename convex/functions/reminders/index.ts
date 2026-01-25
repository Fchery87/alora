import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireUserId,
} from "../../lib/users";

export const list = query({
  args: {
    babyId: v.id("babies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_baby", (q) => q.eq("babyId", args.babyId))
      .order("desc")
      .take(args.limit || 50);

    return reminders;
  },
});

export const getByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authenticatedUserId = await requireUserId(ctx);

    // User can only access their own reminders
    if (authenticatedUserId !== args.userId) {
      throw new Error("Not authorized to view reminders for this user");
    }

    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 50);

    return reminders;
  },
});

export const get = query({
  args: {
    id: v.id("reminders"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const reminder = await ctx.db.get(args.id);
    if (!reminder) throw new Error("Reminder not found");

    // Verify user has access to this reminder
    await requireBabyAccess(ctx, reminder.babyId);

    return reminder;
  },
});

export const create = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(
      v.literal("feeding"),
      v.literal("sleep"),
      v.literal("diaper"),
      v.literal("custom")
    ),
    title: v.string(),
    message: v.optional(v.string()),
    intervalMinutes: v.optional(v.number()),
    specificTime: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
    isEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireMutationUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("reminders", {
      ...args,
      userId,
      isEnabled: args.isEnabled ?? true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("reminders"),
    title: v.optional(v.string()),
    message: v.optional(v.string()),
    intervalMinutes: v.optional(v.number()),
    specificTime: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
    isEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Reminder not found");

    await requireBabyAccess(ctx, existing.babyId);

    return await ctx.db.patch(id, updates);
  },
});

export const toggleEnabled = mutation({
  args: {
    id: v.id("reminders"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const reminder = await ctx.db.get(args.id);
    if (!reminder) {
      throw new Error("Reminder not found");
    }

    await requireBabyAccess(ctx, reminder.babyId);

    return await ctx.db.patch(args.id, {
      isEnabled: !reminder.isEnabled,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("reminders"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const reminder = await ctx.db.get(args.id);
    if (!reminder) throw new Error("Reminder not found");

    await requireBabyAccess(ctx, reminder.babyId);

    return await ctx.db.delete(args.id);
  },
});

import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { calculatePercentile } from "../../../lib/growth";
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
    const growth = await ctx.db
      .query("growth")
      .withIndex("by_baby", (q) => q.eq("babyId", args.babyId))
      .collect();
    return growth.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
});

export const get = query({
  args: { id: v.id("growth") },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const record = await ctx.db.get(args.id);
    if (!record) {
      return null;
    }
    await requireBabyAccess(ctx, record.babyId);
    return record;
  },
});

export const create = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(
      v.literal("weight"),
      v.literal("length"),
      v.literal("head_circumference")
    ),
    value: v.number(),
    unit: v.string(),
    date: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const baby = await requireBabyAccess(ctx, args.babyId);

    const birthDate = new Date(baby.birthDate);
    const measurementDate = new Date(args.date);
    const ageMonths =
      (measurementDate.getTime() - birthDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30.44);
    const sex = baby.gender === "other" ? "male" : baby.gender || "male";
    const percentile = calculatePercentile(
      args.value,
      args.type,
      ageMonths,
      sex
    );

    const growthId = await ctx.db.insert("growth", {
      babyId: args.babyId,
      type: args.type,
      value: args.value,
      unit: args.unit,
      date: args.date,
      notes: args.notes,
      percentile: percentile ?? undefined,
    });

    return growthId;
  },
});

export const update = mutation({
  args: {
    id: v.id("growth"),
    type: v.optional(
      v.union(
        v.literal("weight"),
        v.literal("length"),
        v.literal("head_circumference")
      )
    ),
    value: v.optional(v.number()),
    unit: v.optional(v.string()),
    date: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Growth measurement not found");
    await requireBabyAccess(ctx, existing.babyId);

    if (existing.babyId) {
      const baby = await ctx.db.get(existing.babyId);
      if (baby) {
        const birthDate = new Date(baby.birthDate);
        const measurementDate = new Date(updates.date || existing.date);
        const ageMonths =
          (measurementDate.getTime() - birthDate.getTime()) /
          (1000 * 60 * 60 * 24 * 30.44);
        const newType = updates.type || existing.type;
        const newValue = updates.value ?? existing.value;
        const sex = baby.gender === "other" ? "male" : baby.gender || "male";
        const percentile = calculatePercentile(
          newValue,
          newType,
          ageMonths,
          sex
        );
        (updates as any).percentile = percentile ?? undefined;
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("growth") },
  handler: async (ctx, args) => {
    await requireMutationUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Growth measurement not found");
    await requireBabyAccess(ctx, existing.babyId);
    await ctx.db.delete(args.id);
  },
});

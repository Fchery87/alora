import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireOrganizationId, requireUserId } from "../../lib/users";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db.get(userId);
    return user;
  },
});

export const getUsersByIds = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const users = await Promise.all(args.userIds.map((id) => ctx.db.get(id)));
    return users.filter((user) => user !== undefined);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const users = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("clerkOrganizationId"), orgId))
      .collect();

    return users;
  },
});

export const exportUserData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const orgId = await requireOrganizationId(ctx);
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get all babies in the organization
    const babies = await ctx.db
      .query("babies")
      .withIndex("by_family", (q: any) => q.eq("clerkOrganizationId", orgId))
      .collect();

    const babyIds = babies.map((b: any) => b._id);

    // Get all tracking data for these babies
    const feeds = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("feeds")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    const diapers = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("diapers")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    const sleep = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("sleep")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    const growth = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("growth")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    const milestones = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("milestones")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    // Get user's journal entries
    const journal = await ctx.db
      .query("journal")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    const moodCheckIns = await ctx.db
      .query("moodCheckIns")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    // Get reminders and appointments
    const reminders = await Promise.all(
      babyIds.map(async (babyId: any) => {
        const records = await ctx.db
          .query("reminders")
          .withIndex("by_baby", (q: any) => q.eq("babyId", babyId))
          .collect();
        return records;
      })
    ).then((results) => results.flat());

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_family", (q: any) => q.eq("clerkOrganizationId", orgId))
      .collect();

    const medications = await ctx.db
      .query("medications")
      .withIndex("by_family", (q: any) => q.eq("clerkOrganizationId", orgId))
      .collect();

    // Compile export data
    const exportData = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        userId: user._id,
        organizationId: orgId,
        version: "1.0",
      },
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
      babies: babies.map((baby: any) => ({
        id: baby._id,
        name: baby.name,
        birthDate: baby.birthDate,
        gender: baby.gender,
        photoUrl: baby.photoUrl,
        createdAt: baby.createdAt,
      })),
      feeds: feeds.map((f: any) => ({
        id: f._id,
        babyId: f.babyId,
        type: f.type,
        side: f.side,
        amount: f.amount,
        duration: f.duration,
        startTime: f.startTime,
        endTime: f.endTime,
        notes: f.notes,
        createdById: f.createdById,
      })),
      diapers: diapers.map((d: any) => ({
        id: d._id,
        babyId: d.babyId,
        type: d.type,
        color: d.color,
        notes: d.notes,
        startTime: d.startTime,
        createdById: d.createdById,
      })),
      sleep: sleep.map((s: any) => ({
        id: s._id,
        babyId: s.babyId,
        type: s.type,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.duration,
        quality: s.quality,
        notes: s.notes,
        createdById: s.createdById,
      })),
      growth: growth.map((g: any) => ({
        id: g._id,
        babyId: g.babyId,
        type: g.type,
        value: g.value,
        unit: g.unit,
        date: g.date,
        percentile: g.percentile,
        notes: g.notes,
      })),
      milestones: milestones.map((m: any) => ({
        id: m._id,
        babyId: m.babyId,
        title: m.title,
        description: m.description,
        category: m.category,
        date: m.date,
        isCelebrated: m.isCelebrated,
        isCustom: m.isCustom,
      })),
      journal: journal.map((j: any) => ({
        id: j._id,
        title: j.title,
        content: j.content,
        mood: j.mood,
        tags: j.tags,
        isGratitude: j.isGratitude,
        isWin: j.isWin,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      })),
      moodCheckIns: moodCheckIns.map((m: any) => ({
        id: m._id,
        mood: m.mood,
        energy: m.energy,
        anxiety: m.anxiety,
        notes: m.notes,
        tags: m.tags,
        createdAt: m.createdAt,
      })),
      reminders: reminders.map((r: any) => ({
        id: r._id,
        babyId: r.babyId,
        type: r.type,
        title: r.title,
        message: r.message,
        intervalMinutes: r.intervalMinutes,
        specificTime: r.specificTime,
        isEnabled: r.isEnabled,
        daysOfWeek: r.daysOfWeek,
      })),
      appointments: appointments.map((a: any) => ({
        id: a._id,
        title: a.title,
        type: a.type,
        date: a.date,
        time: a.time,
        location: a.location,
        notes: a.notes,
        isCompleted: a.isCompleted,
        createdAt: a.createdAt,
      })),
      medications: medications.map((m: any) => ({
        id: m._id,
        name: m.name,
        type: m.type,
        dosage: m.dosage,
        frequency: m.frequency,
        startDate: m.startDate,
        endDate: m.endDate,
        notes: m.notes,
        isActive: m.isActive,
        reminderEnabled: m.reminderEnabled,
      })),
    };

    return exportData;
  },
});

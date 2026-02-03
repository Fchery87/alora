import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import {
  requireBabyAccess,
  requireUserId,
  requireOrganizationId,
} from "../../lib/users";
import {
  sanitizeTitle,
  sanitizeLocation,
  sanitizeNotes,
} from "../../lib/sanitize";

interface Appointment {
  _id: any;
  _creationTime: number;
  clerkOrganizationId: string;
  babyId?: any;
  userId: any;
  title: string;
  type: "pediatrician" | "checkup" | "vaccine" | "wellness" | "custom";
  date: string;
  time: string;
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly";
  reminderMinutesBefore?: number;
  pushReminderJobId?: Id<"_scheduled_functions">;
  isCompleted?: boolean;
}

export const listAppointments = query({
  args: {
    clerkOrganizationId: v.string(),
    babyId: v.optional(v.id("babies")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: listAppointmentsHandler,
});

export async function listAppointmentsHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);

  // Verify user's org matches requested org (HIPAA compliance)
  if (userOrgId !== args.clerkOrganizationId) {
    throw new Error(
      "Not authorized to view appointments for this organization"
    );
  }

  let appointmentQuery = ctx.db
    .query("appointments" as any)
    .withIndex("by_family_and_date" as any, (q: any) => {
      let chain = q.eq("clerkOrganizationId", userOrgId);
      if (args.startDate) chain = chain.gte("date", args.startDate);
      if (args.endDate) chain = chain.lte("date", args.endDate);
      return chain;
    });

  if (args.babyId) {
    appointmentQuery = appointmentQuery.filter((q: any) =>
      q.eq(q.field("babyId"), args.babyId)
    );
  }

  return (await appointmentQuery
    .order("asc")
    .take(args.limit ?? 100)) as Appointment[];
}

export const getAppointment = query({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const appointment = (await ctx.db.get(
      args.appointmentId
    )) as Appointment | null;
    if (!appointment) throw new Error("Appointment not found");

    // Verify user's org matches appointment's org (HIPAA compliance)
    if (userOrgId !== appointment.clerkOrganizationId) {
      throw new Error("Not authorized to view this appointment");
    }

    return appointment;
  },
});

export const createAppointment = mutation({
  args: {
    babyId: v.optional(v.id("babies")),
    title: v.string(),
    type: v.union(
      v.literal("pediatrician"),
      v.literal("checkup"),
      v.literal("vaccine"),
      v.literal("wellness"),
      v.literal("custom")
    ),
    date: v.string(),
    time: v.string(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    recurringInterval: v.optional(
      v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"))
    ),
    reminderMinutesBefore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    // Sanitize text inputs
    const sanitizedTitle = sanitizeTitle(args.title);
    const sanitizedLocation = args.location
      ? sanitizeLocation(args.location)
      : undefined;
    const sanitizedNotes = args.notes ? sanitizeNotes(args.notes) : undefined;

    const appointmentId = await ctx.db.insert("appointments", {
      clerkOrganizationId: orgId,
      babyId: args.babyId,
      userId: userId,
      title: sanitizedTitle,
      type: args.type,
      date: args.date,
      time: args.time,
      location: sanitizedLocation,
      notes: sanitizedNotes,
      isRecurring: args.isRecurring ?? false,
      recurringInterval: args.recurringInterval,
      reminderMinutesBefore: args.reminderMinutesBefore,
      isCompleted: false,
      createdAt: Date.now(),
    });

    return appointmentId;
  },
});

export async function createAppointmentHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);
  const userId = await requireUserId(ctx);

  // Verify user's org matches requested org (HIPAA compliance)
  if (userOrgId !== args.clerkOrganizationId) {
    throw new Error(
      "Not authorized to create appointment for this organization"
    );
  }

  if (args.babyId) {
    await requireBabyAccess(ctx, args.babyId);
  }

  const appointmentId = await ctx.db.insert("appointments", {
    ...args,
    clerkOrganizationId: userOrgId,
    userId,
    isCompleted: false,
    createdAt: Date.now(),
  });

  if (
    args.reminderMinutesBefore &&
    typeof ctx.scheduler?.runAt === "function"
  ) {
    const triggerMs = computeReminderTimeMs(
      args.date,
      args.time,
      args.reminderMinutesBefore
    );
    if (triggerMs && triggerMs > Date.now()) {
      const jobId = await ctx.scheduler.runAt(
        triggerMs,
        internal.functions.push.index.sendAppointmentReminder,
        {
          clerkOrganizationId: userOrgId,
          appointmentTitle: args.title,
          appointmentWhen: `${args.date} ${args.time}`,
        }
      );
      await ctx.db.patch(appointmentId, { pushReminderJobId: jobId });
    }
  }

  return appointmentId;
}

export const updateAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    reminderMinutesBefore: v.optional(v.number()),
    isCompleted: v.optional(v.boolean()),
  },
  handler: updateAppointmentHandler,
});

export async function updateAppointmentHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);

  const { appointmentId } = args;
  const existing = (await ctx.db.get(appointmentId)) as Appointment | null;
  if (!existing) throw new Error("Appointment not found");

  // Verify user's org matches appointment's org (HIPAA compliance)
  if (userOrgId !== existing.clerkOrganizationId) {
    throw new Error("Not authorized to update this appointment");
  }

  const updates: Record<string, unknown> = {};
  if (args.title !== undefined) updates.title = sanitizeTitle(args.title);
  if (args.date !== undefined) updates.date = args.date;
  if (args.time !== undefined) updates.time = args.time;
  if (args.location !== undefined)
    updates.location = sanitizeLocation(args.location);
  if (args.notes !== undefined) updates.notes = sanitizeNotes(args.notes);
  if (args.reminderMinutesBefore !== undefined)
    updates.reminderMinutesBefore = args.reminderMinutesBefore;
  if (args.isCompleted !== undefined) updates.isCompleted = args.isCompleted;

  if (Object.keys(updates).length > 0) {
    await ctx.db.patch(appointmentId, updates);
  }

  return appointmentId;
}

export const deleteAppointment = mutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const existing = (await ctx.db.get(
      args.appointmentId
    )) as Appointment | null;
    if (!existing) throw new Error("Appointment not found");

    // Verify user's org matches appointment's org (HIPAA compliance)
    if (userOrgId !== existing.clerkOrganizationId) {
      throw new Error("Not authorized to delete this appointment");
    }

    if (
      existing.pushReminderJobId &&
      typeof ctx.scheduler?.cancel === "function"
    ) {
      await ctx.scheduler.cancel(existing.pushReminderJobId);
    }

    await ctx.db.delete(args.appointmentId);
  },
});

export const completeAppointment = mutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const existing = (await ctx.db.get(
      args.appointmentId
    )) as Appointment | null;
    if (!existing) throw new Error("Appointment not found");

    // Verify user's org matches appointment's org (HIPAA compliance)
    if (userOrgId !== existing.clerkOrganizationId) {
      throw new Error("Not authorized to complete this appointment");
    }

    await ctx.db.patch(args.appointmentId, { isCompleted: true });
  },
});

function computeReminderTimeMs(
  date: string,
  time: string,
  minutesBefore: number
): number | null {
  if (typeof date !== "string" || typeof time !== "string") return null;
  const [year, month, day] = date.split("-").map((v) => Number(v));
  const [hours, minutes] = time.split(":").map((v) => Number(v));
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  )
    return null;
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  const local = new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
  return local - minutesBefore * 60 * 1000;
}

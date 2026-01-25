import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import type { Id } from "../../_generated/dataModel";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireOrganizationId,
} from "../../lib/users";

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

  let appointments = (await ctx.db
    .query("appointments" as any)
    .withIndex("by_family" as any, (q: any) =>
      q.eq("clerkOrganizationId", userOrgId)
    )
    .collect()) as Appointment[];

  if (args.babyId) {
    appointments = appointments.filter((a: any) => a.babyId === args.babyId);
  }
  if (args.startDate) {
    appointments = appointments.filter((a: any) => a.date >= args.startDate);
  }
  if (args.endDate) {
    appointments = appointments.filter((a: any) => a.date <= args.endDate);
  }
  return appointments.sort((a: any, b: any) => a.date.localeCompare(b.date));
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
    clerkOrganizationId: v.string(),
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
  handler: createAppointmentHandler,
});

export async function createAppointmentHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);
  const userId = await requireMutationUserId(ctx);

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
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const { appointmentId, ...updates } = args;
    const existing = (await ctx.db.get(appointmentId)) as Appointment | null;
    if (!existing) throw new Error("Appointment not found");

    // Verify user's org matches appointment's org (HIPAA compliance)
    if (userOrgId !== existing.clerkOrganizationId) {
      throw new Error("Not authorized to update this appointment");
    }

    if (
      existing.pushReminderJobId &&
      typeof ctx.scheduler?.cancel === "function"
    ) {
      await ctx.scheduler.cancel(existing.pushReminderJobId);
      (updates as any).pushReminderJobId = undefined;
    }

    await ctx.db.patch(appointmentId, updates);

    const nextTitle = (args.title ?? existing.title) as string;
    const nextDate = (args.date ?? existing.date) as string;
    const nextTime = (args.time ?? existing.time) as string;
    const nextReminder =
      args.reminderMinutesBefore ?? existing.reminderMinutesBefore;

    if (nextReminder && typeof ctx.scheduler?.runAt === "function") {
      const triggerMs = computeReminderTimeMs(nextDate, nextTime, nextReminder);
      if (triggerMs && triggerMs > Date.now()) {
        const jobId = await ctx.scheduler.runAt(
          triggerMs,
          internal.functions.push.index.sendAppointmentReminder,
          {
            clerkOrganizationId: userOrgId,
            appointmentTitle: nextTitle,
            appointmentWhen: `${nextDate} ${nextTime}`,
          }
        );
        await ctx.db.patch(appointmentId, { pushReminderJobId: jobId });
      }
    }
  },
});

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

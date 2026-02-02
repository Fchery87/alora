import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
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
    const userOrgId = await requireOrganizationId(ctx);
    const userId = await requireMutationUserId(ctx);

    if (args.babyId) {
      await requireBabyAccess(ctx, args.babyId);
    }

    return await ctx.db.insert("appointments", {
      clerkOrganizationId: userOrgId,
      babyId: args.babyId,
      title: sanitizeTitle(args.title),
      type: args.type,
      date: args.date,
      time: args.time,
      location: sanitizeLocation(args.location),
      notes: sanitizeNotes(args.notes),
      isRecurring: args.isRecurring,
      recurringInterval: args.recurringInterval,
      reminderMinutesBefore: args.reminderMinutesBefore,
      userId,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

export const updateAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
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

    await ctx.db.patch(appointmentId, {
      ...updates,
      title: updates.title ? sanitizeTitle(updates.title) : undefined,
      location:
        updates.location !== undefined
          ? sanitizeLocation(updates.location)
          : undefined,
      notes:
        updates.notes !== undefined ? sanitizeNotes(updates.notes) : undefined,
    });
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

import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireOrganizationId,
} from "../../lib/users";
import {
  sanitizeName,
  sanitizeText,
  sanitizeNotes,
  sanitizeStringArray,
} from "../../lib/sanitize";

interface Medication {
  _id: any;
  _creationTime: number;
  clerkOrganizationId: string;
  babyId?: any;
  userId: any;
  name: string;
  type: "prescription" | "otc" | "supplement";
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled?: boolean;
  reminderTimes?: string[];
  isActive?: boolean;
}

export const listMedications = query({
  args: {
    clerkOrganizationId: v.string(),
    babyId: v.optional(v.id("babies")),
    isActive: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: listMedicationsHandler,
});

export async function listMedicationsHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);

  // Verify user's org matches requested org (HIPAA compliance)
  if (userOrgId !== args.clerkOrganizationId) {
    throw new Error("Not authorized to view medications for this organization");
  }

  let medicationQuery = ctx.db
    .query("medications" as any)
    .withIndex("by_family" as any, (q: any) =>
      q.eq("clerkOrganizationId", userOrgId)
    );

  if (args.babyId) {
    medicationQuery = medicationQuery.filter((q: any) =>
      q.eq(q.field("babyId"), args.babyId)
    );
  }
  if (args.isActive !== undefined) {
    medicationQuery = medicationQuery.filter((q: any) =>
      q.eq(q.field("isActive"), args.isActive)
    );
  }

  return (await medicationQuery.take(args.limit ?? 100)) as Medication[];
}

export const getMedication = query({
  args: { medicationId: v.id("medications") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const medication = (await ctx.db.get(
      args.medicationId
    )) as Medication | null;
    if (!medication) throw new Error("Medication not found");

    // Verify user's org matches medication's org (HIPAA compliance)
    if (userOrgId !== medication.clerkOrganizationId) {
      throw new Error("Not authorized to view this medication");
    }

    return medication;
  },
});

export const createMedication = mutation({
  args: {
    babyId: v.optional(v.id("babies")),
    name: v.string(),
    type: v.union(
      v.literal("prescription"),
      v.literal("otc"),
      v.literal("supplement")
    ),
    dosage: v.optional(v.string()),
    frequency: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTimes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);
    const userId = await requireMutationUserId(ctx);

    if (args.babyId) {
      await requireBabyAccess(ctx, args.babyId);
    }

    return await ctx.db.insert("medications", {
      clerkOrganizationId: userOrgId,
      babyId: args.babyId,
      name: sanitizeName(args.name),
      type: args.type,
      dosage: args.dosage ? sanitizeText(args.dosage) : undefined,
      frequency: args.frequency ? sanitizeText(args.frequency) : undefined,
      startDate: args.startDate,
      endDate: args.endDate,
      notes: sanitizeNotes(args.notes),
      reminderEnabled: args.reminderEnabled,
      reminderTimes: args.reminderTimes
        ? sanitizeStringArray(args.reminderTimes)
        : undefined,
      userId,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export async function createMedicationHandler(ctx: any, args: any) {
  const userOrgId = await requireOrganizationId(ctx);
  const userId = await requireMutationUserId(ctx);

  if (userOrgId !== args.clerkOrganizationId) {
    throw new Error("Not authorized to create medication for this organization");
  }

  if (args.babyId) {
    await requireBabyAccess(ctx, args.babyId);
  }

  return await ctx.db.insert("medications", {
    clerkOrganizationId: userOrgId,
    babyId: args.babyId,
    name: sanitizeName(args.name),
    type: args.type,
    dosage: args.dosage ? sanitizeText(args.dosage) : undefined,
    frequency: args.frequency ? sanitizeText(args.frequency) : undefined,
    startDate: args.startDate,
    endDate: args.endDate,
    notes: sanitizeNotes(args.notes),
    reminderEnabled: args.reminderEnabled,
    reminderTimes: args.reminderTimes
      ? sanitizeStringArray(args.reminderTimes)
      : undefined,
    userId,
    isActive: true,
    createdAt: Date.now(),
  });
}

export const updateMedication = mutation({
  args: {
    medicationId: v.id("medications"),
    name: v.optional(v.string()),
    dosage: v.optional(v.string()),
    frequency: v.optional(v.string()),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTimes: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const { medicationId, ...updates } = args;
    const existing = (await ctx.db.get(medicationId)) as Medication | null;
    if (!existing) throw new Error("Medication not found");

    // Verify user's org matches medication's org (HIPAA compliance)
    if (userOrgId !== existing.clerkOrganizationId) {
      throw new Error("Not authorized to update this medication");
    }

    await ctx.db.patch(medicationId, {
      ...updates,
      name: updates.name ? sanitizeName(updates.name) : undefined,
      dosage:
        updates.dosage !== undefined ? sanitizeText(updates.dosage) : undefined,
      frequency:
        updates.frequency !== undefined
          ? sanitizeText(updates.frequency)
          : undefined,
      notes:
        updates.notes !== undefined ? sanitizeNotes(updates.notes) : undefined,
      reminderTimes:
        updates.reminderTimes !== undefined
          ? sanitizeStringArray(updates.reminderTimes)
          : undefined,
    });
  },
});

export const deleteMedication = mutation({
  args: { medicationId: v.id("medications") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const existing = (await ctx.db.get(args.medicationId)) as Medication | null;
    if (!existing) throw new Error("Medication not found");

    // Verify user's org matches medication's org (HIPAA compliance)
    if (userOrgId !== existing.clerkOrganizationId) {
      throw new Error("Not authorized to delete this medication");
    }

    await ctx.db.delete(args.medicationId);
  },
});

export const toggleMedicationActive = mutation({
  args: { medicationId: v.id("medications") },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    const medication = (await ctx.db.get(
      args.medicationId
    )) as Medication | null;
    if (!medication) {
      throw new Error("Medication not found");
    }

    // Verify user's org matches medication's org (HIPAA compliance)
    if (userOrgId !== medication.clerkOrganizationId) {
      throw new Error("Not authorized to modify this medication");
    }

    await ctx.db.patch(args.medicationId, {
      isActive: !medication.isActive,
    });
  },
});

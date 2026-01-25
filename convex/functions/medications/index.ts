import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import {
  requireBabyAccess,
  requireMutationUserId,
  requireOrganizationId,
} from "../../lib/users";

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
  },
  handler: async (ctx, args) => {
    const userOrgId = await requireOrganizationId(ctx);

    // Verify user's org matches requested org (HIPAA compliance)
    if (userOrgId !== args.clerkOrganizationId) {
      throw new Error(
        "Not authorized to view medications for this organization"
      );
    }

    let medications = (await ctx.db
      .query("medications" as any)
      .withIndex("by_family" as any, (q: any) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .collect()) as Medication[];

    if (args.babyId) {
      medications = medications.filter((m) => m.babyId === args.babyId);
    }
    if (args.isActive !== undefined) {
      medications = medications.filter((m) => m.isActive === args.isActive);
    }
    return medications;
  },
});

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
    clerkOrganizationId: v.string(),
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

    // Verify user's org matches requested org (HIPAA compliance)
    if (userOrgId !== args.clerkOrganizationId) {
      throw new Error(
        "Not authorized to create medication for this organization"
      );
    }

    if (args.babyId) {
      await requireBabyAccess(ctx, args.babyId);
    }

    return await ctx.db.insert("medications", {
      ...args,
      userId,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

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

    await ctx.db.patch(medicationId, updates);
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

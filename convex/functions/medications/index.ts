import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";

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
    return await ctx.db.get(args.medicationId);
  },
});

export const createMedication = mutation({
  args: {
    clerkOrganizationId: v.string(),
    babyId: v.optional(v.id("babies")),
    userId: v.id("users"),
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
    return await ctx.db.insert("medications", {
      ...args,
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
    const { medicationId, ...updates } = args;
    await ctx.db.patch(medicationId, updates);
  },
});

export const deleteMedication = mutation({
  args: { medicationId: v.id("medications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.medicationId);
  },
});

export const toggleMedicationActive = mutation({
  args: { medicationId: v.id("medications") },
  handler: async (ctx, args) => {
    const medication = await ctx.db.get(args.medicationId);
    if (medication) {
      await ctx.db.patch(args.medicationId, {
        isActive: !(medication as any).isActive,
      });
    }
  },
});

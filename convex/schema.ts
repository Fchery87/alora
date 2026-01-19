import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_email", ["email"]),

  families: defineTable({
    clerkOrganizationId: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    settings: v.optional(
      v.object({
        premiumPlan: v.union(v.literal("free"), v.literal("premium")),
        premiumExpiry: v.optional(v.number()),
      })
    ),
  }).index("by_clerk_org_id", ["clerkOrganizationId"]),

  babies: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
    birthDate: v.number(),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"))
    ),
    photoUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_family", ["clerkOrganizationId"])
    .index("by_family_and_birth", ["clerkOrganizationId", "birthDate"]),
});

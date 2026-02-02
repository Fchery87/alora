import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    clerkOrganizationId: v.optional(v.string()),
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

  feeds: defineTable({
    babyId: v.id("babies"),
    type: v.union(
      v.literal("breast"),
      v.literal("formula"),
      v.literal("solid")
    ),
    side: v.optional(
      v.union(v.literal("left"), v.literal("right"), v.literal("both"))
    ),
    amount: v.optional(v.string()),
    duration: v.optional(v.number()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdById: v.id("users"),
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_time", ["babyId", "startTime"])
    .index("by_time", ["startTime"]),

  diapers: defineTable({
    babyId: v.id("babies"),
    type: v.union(
      v.literal("wet"),
      v.literal("solid"),
      v.literal("both"),
      v.literal("mixed")
    ),
    color: v.optional(
      v.union(
        v.literal("yellow"),
        v.literal("orange"),
        v.literal("green"),
        v.literal("brown"),
        v.literal("red")
      )
    ),
    notes: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    createdById: v.id("users"),
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_time", ["babyId", "startTime"])
    .index("by_time", ["startTime"]),

  sleep: defineTable({
    babyId: v.id("babies"),
    type: v.union(v.literal("nap"), v.literal("night"), v.literal("day")),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    quality: v.union(
      v.literal("awake"),
      v.literal("drowsy"),
      v.literal("sleeping"),
      v.literal("deep")
    ),
    notes: v.optional(v.string()),
    createdById: v.id("users"),
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_time", ["babyId", "startTime"])
    .index("by_time", ["startTime"]),

  growth: defineTable({
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
    percentile: v.optional(v.number()),
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_date", ["babyId", "date"]),

  milestones: defineTable({
    babyId: v.id("babies"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("motor"),
      v.literal("cognitive"),
      v.literal("language"),
      v.literal("social"),
      v.literal("custom")
    ),
    date: v.optional(v.string()),
    ageMonths: v.optional(v.number()),
    isCustom: v.boolean(),
    isCelebrated: v.boolean(),
    photoUrl: v.optional(v.string()),
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_date", ["babyId", "date"]),

  journal: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    content: v.string(),
    mood: v.optional(
      v.union(
        v.literal("great"),
        v.literal("good"),
        v.literal("okay"),
        v.literal("low"),
        v.literal("struggling")
      )
    ),
    tags: v.optional(v.array(v.string())),
    babyId: v.optional(v.id("babies")),
    isGratitude: v.optional(v.boolean()),
    isWin: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  moodCheckIns: defineTable({
    userId: v.id("users"),
    babyId: v.optional(v.id("babies")),
    mood: v.union(
      v.literal("great"),
      v.literal("good"),
      v.literal("okay"),
      v.literal("low"),
      v.literal("struggling")
    ),
    energy: v.optional(
      v.union(v.literal("high"), v.literal("medium"), v.literal("low"))
    ),
    anxiety: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  reminders: defineTable({
    babyId: v.id("babies"),
    userId: v.id("users"),
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
    isEnabled: v.boolean(),
    daysOfWeek: v.optional(v.array(v.number())),
  })
    .index("by_baby", ["babyId"])
    .index("by_user", ["userId"])
    .index("by_baby_and_enabled", ["babyId", "isEnabled"]),

  appointments: defineTable({
    clerkOrganizationId: v.string(),
    babyId: v.optional(v.id("babies")),
    userId: v.id("users"),
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
    pushReminderJobId: v.optional(v.id("_scheduled_functions")),
    isCompleted: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_family", ["clerkOrganizationId"])
    .index("by_baby", ["babyId"])
    .index("by_date", ["date"])
    .index("by_family_and_date", ["clerkOrganizationId", "date"]),

  medications: defineTable({
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
    isActive: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_family", ["clerkOrganizationId"])
    .index("by_baby", ["babyId"])
    .index("by_active", ["isActive"]),

  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    resetAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_reset", ["resetAt"]),

  aiDailyInsights: defineTable({
    clerkOrganizationId: v.string(),
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD (local to user device; provided by client, but stored/cached per user)
    model: v.string(),
    promptVersion: v.string(),
    title: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_and_date", ["userId", "date"])
    .index("by_org_and_date", ["clerkOrganizationId", "date"]),

  userPreferences: defineTable({
    clerkOrganizationId: v.string(),
    userId: v.id("users"),
    aiInsightsEnabled: v.boolean(),
    pushNotificationsEnabled: v.optional(v.boolean()),
    updatedAt: v.number(),
  })
    .index("by_user_and_org", ["userId", "clerkOrganizationId"])
    .index("by_org", ["clerkOrganizationId"]),

  pushTokens: defineTable({
    clerkOrganizationId: v.string(),
    userId: v.id("users"),
    expoPushToken: v.string(),
    platform: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_token", ["userId", "expoPushToken"])
    .index("by_org", ["clerkOrganizationId"]),
});

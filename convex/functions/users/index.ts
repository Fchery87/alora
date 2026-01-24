import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireUserId } from "../../lib/users";

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
    const userId = await requireUserId(ctx);

    // Get the current user
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Return users from the same family
    const users = await ctx.db
      .query("users")
      .withIndex("by_family", (q) => q.eq("familyId", user.familyId))
      .collect();

    return users;
  },
});

// Re-export sync mutations from sync.ts
export const sync = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, email, name, avatarUrl } = args;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    const now = Date.now();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: name || existingUser.name,
        avatarUrl: avatarUrl || existingUser.avatarUrl,
        lastActiveAt: now,
      });
      return { action: "updated", userId: existingUser._id };
    }

    const userId = await ctx.db.insert("users", {
      clerkUserId,
      email,
      name,
      avatarUrl,
      createdAt: now,
      lastActiveAt: now,
    });
    return { action: "created", userId };
  },
});

export const updateLastActive = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) return { status: "not_found" };

    await ctx.db.patch(user._id, { lastActiveAt: Date.now() });
    return { status: "updated", userId: user._id };
  },
});

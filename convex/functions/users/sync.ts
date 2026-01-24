import { mutation } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Sync user data from Clerk to Convex
 * Called during authentication or when user data changes
 */
export const sync = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, email, name, avatarUrl } = args;

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: name || existingUser.name,
        avatarUrl: avatarUrl || existingUser.avatarUrl,
        lastActiveAt: now,
      });

      console.log("Synced existing user:", existingUser._id);
      return {
        action: "updated",
        userId: existingUser._id,
        clerkUserId,
      };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkUserId,
      email,
      name,
      avatarUrl,
      createdAt: now,
      lastActiveAt: now,
    });

    console.log("Synced new user:", userId);
    return {
      action: "created",
      userId,
      clerkUserId,
    };
  },
});

/**
 * Update last active timestamp
 */
export const updateLastActive = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) {
      console.log("User not found for last active update");
      return { status: "not_found" };
    }

    await ctx.db.patch(user._id, {
      lastActiveAt: Date.now(),
    });

    console.log("Updated last active for user:", user._id);
    return { status: "updated", userId: user._id };
  },
});

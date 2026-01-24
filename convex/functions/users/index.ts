import { query } from "../../_generated/server";
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

    // Return all users (family concept is managed via Clerk organizations)
    const users = await ctx.db
      .query("users")
      .collect();

    return users;
  },
});

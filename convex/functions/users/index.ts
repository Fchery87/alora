import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireOrganizationId, requireUserId } from "../../lib/users";

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
    await requireUserId(ctx);
    const orgId = await requireOrganizationId(ctx);

    const users = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("clerkOrganizationId"), orgId))
      .collect();

    return users;
  },
});

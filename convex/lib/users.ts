import type { UserIdentity } from "convex/server";
import type { Id } from "../_generated/dataModel";

const DEFAULT_EMAIL = "unknown@local";

export async function getOrCreateUserId(
  ctx: {
    db: {
      query: (table: "users") => {
        withIndex: (
          name: "by_clerk_user_id",
          fn: (q: { eq: (field: "clerkUserId", value: string) => void }) => void
        ) => { first: () => Promise<{ _id: Id<"users"> } | null> };
      };
      insert: (
        table: "users",
        doc: {
          clerkUserId: string;
          email: string;
          name?: string;
          avatarUrl?: string;
          createdAt: number;
          lastActiveAt: number;
        }
      ) => Promise<Id<"users">>;
      patch: (
        id: Id<"users">,
        patch: { lastActiveAt: number }
      ) => Promise<void>;
    };
  },
  identity: UserIdentity
): Promise<Id<"users">> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) =>
      q.eq("clerkUserId", identity.subject)
    )
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, { lastActiveAt: Date.now() });
    return existing._id;
  }

  return await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email: identity.email ?? DEFAULT_EMAIL,
    name: identity.name,
    avatarUrl: identity.pictureUrl,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
}

export async function requireIdentity(ctx: {
  auth: { getUserIdentity: () => Promise<UserIdentity | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function requireUserId(ctx: {
  auth: { getUserIdentity: () => Promise<UserIdentity | null> };
  db: Parameters<typeof getOrCreateUserId>[0]["db"];
}) {
  const identity = await requireIdentity(ctx);
  return await getOrCreateUserId(ctx, identity);
}

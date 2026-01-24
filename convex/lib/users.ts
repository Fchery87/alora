import type { UserIdentity, QueryCtx, MutationCtx } from "convex/server";
import type { Id } from "../_generated/dataModel";

const DEFAULT_EMAIL = "unknown@local";

export async function getUserId(
  ctx: QueryCtx,
  identity: UserIdentity
): Promise<Id<"users"> | null> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) =>
      q.eq("clerkUserId", identity.subject)
    )
    .first();

  return existing?._id ?? null;
}

export async function getOrCreateUserId(
  ctx: MutationCtx,
  identity: UserIdentity
): Promise<Id<"users">> {
  const existingId = await getUserId(ctx, identity);

  if (existingId) {
    await ctx.db.patch(existingId, { lastActiveAt: Date.now() });
    return existingId;
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

export async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function requireOrganizationId(ctx: QueryCtx | MutationCtx) {
  const identity = await requireIdentity(ctx);
  if (!identity.orgId) {
    throw new Error("Organization not found");
  }
  return identity.orgId;
}

export async function requireUserId(ctx: QueryCtx): Promise<Id<"users">> {
  const identity = await requireIdentity(ctx);
  const userId = await getUserId(ctx, identity);
  if (!userId) {
    throw new Error("User not found");
  }
  return userId;
}

export async function requireMutationUserId(ctx: MutationCtx): Promise<Id<"users">> {
  const identity = await requireIdentity(ctx);
  return await getOrCreateUserId(ctx, identity);
}

export async function requireBabyAccess(
  ctx: QueryCtx,
  babyId: Id<"babies">
) {
  const orgId = await requireOrganizationId(ctx);
  const baby = await ctx.db.get(babyId);
  if (!baby) {
    throw new Error("Baby not found");
  }
  if (baby.clerkOrganizationId !== orgId) {
    throw new Error("Not authorized");
  }
  return baby;
}

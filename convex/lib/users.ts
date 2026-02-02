import type { UserIdentity } from "convex/server";
import type { Id } from "../_generated/dataModel";

const DEFAULT_EMAIL = "unknown@local";

export async function getUserId(
  ctx: any,
  identity: UserIdentity
): Promise<Id<"users"> | null> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) =>
      q.eq("clerkUserId", identity.subject)
    )
    .first();

  return existing?._id ?? null;
}

export async function getOrCreateUserId(
  ctx: any,
  identity: UserIdentity
): Promise<Id<"users">> {
  const organizationId =
    (identity.org_id as string | undefined) ??
    (identity.orgId as string | undefined) ??
    undefined;

  const existingId = await getUserId(ctx, identity);

  if (existingId) {
    await ctx.db.patch(existingId, {
      lastActiveAt: Date.now(),
      clerkOrganizationId: organizationId,
    });
    return existingId;
  }

  return await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    clerkOrganizationId: organizationId,
    email: identity.email ?? DEFAULT_EMAIL,
    name: identity.name,
    avatarUrl: identity.pictureUrl,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
}

export async function requireIdentity(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const organizationId =
    (identity.org_id as string | undefined) ??
    (identity.orgId as string | undefined) ??
    undefined;

  if (!organizationId) {
    if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
      console.log("Missing orgId in identity:", {
        subject: identity.subject,
        issuer: identity.issuer,
        orgId: organizationId,
        tokenIdentifier: identity.tokenIdentifier,
      });
    }
  }

  return identity;
}

export async function requireOrganizationId(ctx: any) {
  const identity = await requireIdentity(ctx);
  const organizationId =
    (identity.org_id as string | undefined) ??
    (identity.orgId as string | undefined) ??
    undefined;

  if (!organizationId) {
    throw new Error("Organization not found");
  }

  return organizationId;
}

export async function requireUserId(ctx: any): Promise<Id<"users">> {
  const identity = await requireIdentity(ctx);
  const userId = await getUserId(ctx, identity);
  if (!userId) {
    throw new Error("User not found");
  }
  return userId;
}

export async function requireMutationUserId(ctx: any): Promise<Id<"users">> {
  const identity = await requireIdentity(ctx);
  return await getOrCreateUserId(ctx, identity);
}

export async function requireBabyAccess(ctx: any, babyId: Id<"babies">) {
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

import { describe, it, expect } from "vitest";
import type { UserIdentity } from "convex/server";
import { getOrCreateUserId, requireUserId } from "../../convex/lib/users";

type UserDoc = {
  _id: string;
  clerkUserId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: number;
  lastActiveAt: number;
};

type FakeCtx = {
  db: {
    users: UserDoc[];
    inserts: UserDoc[];
    query: (table: "users") => {
      withIndex: (
        name: string,
        fn: (q: { eq: (field: string, value: string) => void }) => void
      ) => { first: () => Promise<UserDoc | null> };
    };
    insert: (table: "users", doc: Omit<UserDoc, "_id">) => Promise<string>;
    patch: (id: string, patch: Partial<UserDoc>) => Promise<void>;
  };
};

const makeCtx = (seed: UserDoc[] = []): FakeCtx => {
  const ctx: FakeCtx = {
    db: {
      users: [...seed],
      inserts: [],
      query: () => ({
        withIndex: (_name, fn) => {
          let target: string | undefined;
          fn({
            eq: (_field, value) => {
              target = value;
            },
          });
          return {
            first: async () =>
              ctx.db.users.find((u) => u.clerkUserId === target) || null,
          };
        },
      }),
      insert: async (_table, doc) => {
        const id = `user_${ctx.db.users.length + 1}`;
        const record = { _id: id, ...doc } as UserDoc;
        ctx.db.users.push(record);
        ctx.db.inserts.push(record);
        return id;
      },
      patch: async (id, patch) => {
        const index = ctx.db.users.findIndex((u) => u._id === id);
        if (index >= 0) {
          ctx.db.users[index] = { ...ctx.db.users[index], ...patch };
        }
      },
    },
  };
  return ctx;
};

const identity = (overrides: Partial<UserIdentity> = {}): UserIdentity => ({
  tokenIdentifier: "token|clerk|abc",
  subject: "user_abc",
  issuer: "https://clerk.dev",
  email: "user@example.com",
  name: "Test User",
  pictureUrl: "https://example.com/avatar.png",
  ...overrides,
});

describe("getOrCreateUserId", () => {
  it("returns existing user id when clerk user exists", async () => {
    const ctx = makeCtx([
      {
        _id: "user_1",
        clerkUserId: "user_abc",
        email: "old@example.com",
        name: "Old Name",
        createdAt: 1,
        lastActiveAt: 1,
      },
    ]);

    const userId = await getOrCreateUserId(ctx, identity());

    expect(userId).toBe("user_1");
    expect(ctx.db.inserts).toHaveLength(0);
  });

  it("creates a user record when missing", async () => {
    const ctx = makeCtx();

    const userId = await getOrCreateUserId(ctx, identity());

    expect(userId).toBe("user_1");
    expect(ctx.db.inserts).toHaveLength(1);
    expect(ctx.db.inserts[0].clerkUserId).toBe("user_abc");
    expect(ctx.db.inserts[0].email).toBe("user@example.com");
  });
});

describe("requireUserId", () => {
  it("throws when unauthenticated", async () => {
    const ctx = {
      auth: { getUserIdentity: async () => null },
      db: {} as FakeCtx["db"],
    };

    await expect(requireUserId(ctx)).rejects.toThrow("Not authenticated");
  });
});

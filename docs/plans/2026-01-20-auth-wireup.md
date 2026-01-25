# Auth Wireup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire Clerk authentication end-to-end with Convex and fix auth-related data access while keeping tests in place.

**Architecture:** Use Clerk JWTs on the client via `ConvexProviderWithClerk` and remove `@convex-dev/auth` usage/server config. On the backend, derive the current user from `ctx.auth.getUserIdentity()` and map to a real `users` document, then gate access by that user id.

**Tech Stack:** Expo + Clerk Expo, Convex React client, Convex server functions, Vitest.

### Task 1: Add failing tests for user mapping helper

**Files:**
- Create: `__tests__/convex/users.test.ts`
- Create: `convex/lib/users.ts`

**Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import type { UserIdentity } from "convex/server";
import { getOrCreateUserId } from "../../convex/lib/users";

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
            first: async () => ctx.db.users.find((u) => u.clerkUserId === target) || null,
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
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- __tests__/convex/users.test.ts`
Expected: FAIL with module not found or missing export for `getOrCreateUserId`.

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add __tests__/convex/users.test.ts convex/lib/users.ts
git commit -m "test: add user mapping helper coverage"
```

### Task 2: Wire Convex functions to real user ids and ownership checks

**Files:**
- Modify: `convex/functions/feeds/index.ts`
- Modify: `convex/functions/diapers/index.ts`
- Modify: `convex/functions/sleep/index.ts`
- Modify: `convex/functions/journal/index.ts`
- Modify: `convex/functions/wellness/index.ts`
- Modify: `convex/functions/growth/index.ts`
- Modify: `convex/functions/milestones/index.ts`

**Step 1: Write a failing test**

```ts
import { describe, it, expect } from "vitest";
import { requireUserId } from "../../convex/lib/users";

const ctx = { auth: { getUserIdentity: async () => null } } as const;

describe("requireUserId", () => {
  it("throws when unauthenticated", async () => {
    await expect(requireUserId(ctx as any)).rejects.toThrow("Not authenticated");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/convex/users.test.ts`
Expected: FAIL because `requireUserId` is missing.

**Step 3: Implement minimal helper**

```ts
import type { UserIdentity } from "convex/server";
import type { Id } from "../_generated/dataModel";

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
}) {
  const identity = await requireIdentity(ctx);
  return await getOrCreateUserId(ctx, identity);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Update Convex functions**

- Replace `identity.subject as Id<"users">` with `const userId = await requireUserId(ctx)`
- For `get`, `update`, `delete` functions, ensure the record belongs to `userId` and throw `Not authorized` otherwise.
- For list functions, filter by `createdById === userId` (or `userId` fields where applicable).

**Step 6: Commit**

```bash
git add convex/functions convex/lib/users.ts __tests__/convex/users.test.ts
git commit -m "fix: map Clerk users to Convex ids"
```

### Task 3: Wire Clerk auth to Convex client and remove convex-auth config

**Files:**
- Modify: `app/_layout.tsx`
- Delete: `convex/auth.config.ts`
- Modify: `package.json`

**Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { getConvexAuthProviderName } from "../../lib/convex";

describe("getConvexAuthProviderName", () => {
  it("returns clerk when wired", () => {
    expect(getConvexAuthProviderName()).toBe("clerk");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/convex-auth.test.ts`
Expected: FAIL because helper missing.

**Step 3: Implement minimal helper and wiring**

- Export a tiny helper in `lib/convex.ts` returning `"clerk"`.
- Update `app/_layout.tsx` to use `ConvexProviderWithClerk` with `useAuth` from `@clerk/clerk-expo`.
- Remove `@convex-dev/auth` from dependencies and delete `convex/auth.config.ts`.

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/lib/convex-auth.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add app/_layout.tsx lib/convex.ts convex/auth.config.ts package.json __tests__/lib/convex-auth.test.ts
git commit -m "chore: wire Convex to Clerk auth"
```

### Task 4: Fix dependency conflict and install

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Add `react-test-renderer` dev dependency**

```json
"react-test-renderer": "18.2.0"
```

**Step 2: Install**

Run: `npm install`
Expected: success with no peer dependency errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: align react-test-renderer with React 18"
```

### Task 5: Verification

**Step 1: Run tests**

Run: `npm test`
Expected: PASS

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 3: Summary**

Summarize wiring changes, auth behavior, and any follow-up required (Clerk JWT template named `convex`).

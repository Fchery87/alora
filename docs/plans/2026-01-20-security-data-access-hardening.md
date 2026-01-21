# Security + Data Access Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix authorization holes, make queries read-only safe, correct notification storage/cancellation, and harden local encryption/auth-bypass behavior without breaking planned phases.

**Architecture:** Centralize Convex authorization around baby/family ownership checks; ensure queries never perform writes. Update notification reminder storage to use AsyncStorage and store scheduled notification IDs. Replace AES-CBC with authenticated encryption as specified in the technical design.

**Tech Stack:** Convex, Expo (React Native), Clerk, AsyncStorage, Expo SecureStore, Expo Crypto.

---

### Task 1: Add shared Convex authorization helpers

**Files:**
- Modify: `convex/lib/users.ts`
- Modify: `convex/schema.ts`
- Test: `__tests__/convex/users.test.ts`

**Step 1: Write failing tests for baby/family ownership checks**

```ts
// __tests__/convex/users.test.ts
it("rejects access to baby outside of org", async () => {
  // mock identity with orgA and baby in orgB
  // expect authorizeBabyAccess to throw
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: FAIL with missing helper.

**Step 3: Implement helpers**

```ts
// convex/lib/users.ts
export async function requireOrganizationId(ctx) { /* read identity.orgId */ }
export async function requireBabyAccess(ctx, babyId) { /* load baby and compare org */ }
```

**Step 4: Run tests**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add convex/lib/users.ts convex/schema.ts __tests__/convex/users.test.ts
git commit -m "feat: add Convex baby/family access helpers"
```

---

### Task 2: Enforce authorization in growth/milestones and sanitize patch inputs

**Files:**
- Modify: `convex/functions/growth/index.ts`
- Modify: `convex/functions/milestones/index.ts`
- Modify: `convex/functions/feeds/index.ts`
- Modify: `convex/functions/diapers/index.ts`
- Modify: `convex/functions/sleep/index.ts`
- Modify: `convex/functions/journal/index.ts`
- Test: `__tests__/convex/users.test.ts`

**Step 1: Write failing tests for unauthorized access**

```ts
it("blocks reading growth by other org", async () => {
  // expect list/get to throw
});
```

**Step 2: Run tests**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: FAIL

**Step 3: Implement checks**

```ts
// growth list/get/create/update/remove
await requireBabyAccess(ctx, babyId)

// milestones list/get/create/update/remove/celebrate
await requireBabyAccess(ctx, babyId)
```

Also strip `id` from patch payloads:

```ts
const { id, ...updates } = args
await ctx.db.patch(id, updates)
```

**Step 4: Run tests**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add convex/functions/growth/index.ts convex/functions/milestones/index.ts convex/functions/feeds/index.ts convex/functions/diapers/index.ts convex/functions/sleep/index.ts convex/functions/journal/index.ts __tests__/convex/users.test.ts
git commit -m "fix: enforce baby access and sanitize Convex patches"
```

---

### Task 3: Make Convex queries read-only safe

**Files:**
- Modify: `convex/functions/journal/index.ts`
- Modify: `convex/functions/diapers/index.ts`
- Modify: `convex/functions/wellness/index.ts`

**Step 1: Write failing test for query write**

```ts
it("queries do not call mutation helpers", async () => {
  // ensure listJournal/listDiapers/listMood use requireUserId
});
```

**Step 2: Run tests**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: FAIL

**Step 3: Update queries to use requireUserId**

```ts
const userId = await requireUserId(ctx)
```

**Step 4: Run tests**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add convex/functions/journal/index.ts convex/functions/diapers/index.ts convex/functions/wellness/index.ts __tests__/convex/users.test.ts
git commit -m "fix: make Convex queries read-only safe"
```

---

### Task 4: Fix reminders storage + notification cancellation

**Files:**
- Modify: `hooks/notifications/useNotificationReminders.ts`
- Modify: `lib/notifications.ts`
- Test: `__tests__/hooks/notifications/useNotificationReminders.test.ts`

**Step 1: Write failing test for scheduled ID storage**

```ts
it("stores scheduled notification id and cancels by that id", async () => {
  // schedule -> save notificationId -> cancel using saved id
});
```

**Step 2: Run tests**

Run: `bun run test __tests__/hooks/notifications/useNotificationReminders.test.ts`
Expected: FAIL

**Step 3: Implement AsyncStorage and id mapping**

```ts
// use AsyncStorage instead of localStorage
// store notificationId on reminder records
```

**Step 4: Run tests**

Run: `bun run test __tests__/hooks/notifications/useNotificationReminders.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add hooks/notifications/useNotificationReminders.ts lib/notifications.ts __tests__/hooks/notifications/useNotificationReminders.test.ts
git commit -m "fix: use AsyncStorage and cancel reminders by scheduled id"
```

---

### Task 5: Harden encryption + auth-bypass

**Files:**
- Modify: `lib/encryption.ts`
- Modify: `lib/auth-bypass.ts`
- Test: `__tests__/lib/encryption.test.ts`

**Step 1: Write failing test for authenticated encryption**

```ts
it("rejects tampered ciphertext", async () => {
  // mutate ciphertext and expect decrypt to throw
});
```

**Step 2: Run tests**

Run: `bun run test __tests__/lib/encryption.test.ts`
Expected: FAIL

**Step 3: Implement AES-GCM (expo-crypto) + random iv**

```ts
// use Crypto.getRandomBytesAsync + AES-256-GCM
```

**Step 4: Tighten auth bypass**

```ts
return __DEV__ && process.env.EXPO_PUBLIC_AUTH_BYPASS === "true"
```

**Step 5: Run tests**

Run: `bun run test __tests__/lib/encryption.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add lib/encryption.ts lib/auth-bypass.ts __tests__/lib/encryption.test.ts
git commit -m "fix: authenticated encryption and dev-only auth bypass"
```

---

**Plan complete and saved to `docs/plans/2026-01-20-security-data-access-hardening.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**

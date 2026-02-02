# Core Hardening (Org Scoping, Onboarding, Sign-Out, Calendar) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate cross-org data risk, fix onboarding flow so org+baby creation is reliable, ensure sign-out clears session/caches, and make Calendar wiring predictable.

**Architecture:** Centralize org derivation on the server (Convex) and never trust client org ids for authorization. For UI, prevent premature redirects during onboarding, and ensure session clearing on sign-out. Keep Calendar data normalized at the `CalendarView` boundary.

**Tech Stack:** Expo Router, Clerk (`@clerk/clerk-expo`), Convex, React Query, Vitest.

---

## Phase 0: Baseline + Safety Nets

### Task 0.1: Confirm current test commands and structure

**Files:**
- Inspect: `package.json`
- Inspect: `__tests__/setup.tsx`

**Step 1: Run unit tests to ensure baseline is green**

Run: `bun run test`

Expected: PASS (or record failures before changing anything).

---

## Phase 1: Server-Side Org Scoping (Convex)

### Task 1.1: Inventory all Convex functions that accept `clerkOrganizationId`

**Files:**
- Inspect: `convex/functions/**`

**Step 1: Find all call sites**

Run: `rg -n "clerkOrganizationId" convex/functions -S`

Expected: A list of functions; categorize into:
- (A) Functions that *accept* `clerkOrganizationId` as an arg
- (B) Functions that *read* it from identity (preferred)
- (C) Functions that *write* a document with `clerkOrganizationId`

**Step 2: Decide per-function policy**
- For mutations: prefer **no `clerkOrganizationId` arg**; derive from `requireOrganizationId(ctx)` and write that value.
- For queries: either remove the arg or keep it only for filtering *after* confirming it equals `requireOrganizationId(ctx)`.

### Task 1.2: Add “org match required” unit tests for any function that still accepts `clerkOrganizationId`

**Files:**
- Create/Modify: `__tests__/convex/<domain>.test.ts` (one per module if missing)
- Reference pattern: `__tests__/convex/users.test.ts`

**Step 1: Write a failing test (example template)**

```ts
import { describe, it, expect } from "vitest";
import { listAppointments } from "../../convex/functions/appointments/index";

describe("appointments.listAppointments org scoping", () => {
  it("rejects when args org != identity org", async () => {
    const ctx = {
      auth: { getUserIdentity: async () => ({ orgId: "org_1" }) },
      db: { query: () => ({ withIndex: () => ({ collect: async () => [] }) }) },
    } as any;

    await expect(
      listAppointments.handler(ctx, { clerkOrganizationId: "org_other" })
    ).rejects.toThrow(/Not authorized/i);
  });
});
```

**Step 2: Run test to verify it fails (or fails for the right reason)**

Run: `bun run test __tests__/convex/<domain>.test.ts`

Expected: FAIL until you provide correct ctx stubs or until enforcement exists.

**Step 3: Implement/adjust function code to satisfy the test**
- Ensure `requireOrganizationId(ctx)` is called.
- Ensure mismatch throws.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/convex/<domain>.test.ts`

Expected: PASS.

### Task 1.3: For mutations, remove client org args where feasible

**Files (likely candidates):**
- Modify: `convex/functions/appointments/index.ts`
- Modify: `convex/functions/medications/index.ts` (if present)
- Modify: `convex/functions/babies/index.ts`
- Modify: `convex/functions/families/index.ts`

**Step 1: Write failing tests asserting server-derived org is used**
- If a mutation currently inserts `{ ...args }` containing `clerkOrganizationId`, add a test that:
  - provides an identity org id,
  - passes a different `clerkOrganizationId` in args,
  - and expects the stored doc to use identity org (or to reject mismatch).

**Step 2: Implement minimal refactor**
- Replace usage of `args.clerkOrganizationId` with `const orgId = await requireOrganizationId(ctx)`.
- When inserting: set `clerkOrganizationId: orgId` explicitly and do not spread `args` over it.

**Step 3: Run affected tests**

Run: `bun run test __tests__/convex`

Expected: PASS.

---

## Phase 2: Onboarding Flow Reliability

### Task 2.1: Stop the premature redirect-to-dashboard when `orgId` becomes available

**Files:**
- Modify: `app/(auth)/onboarding.tsx`

**Problem to fix:**
- The effect `if (isSignedIn && orgId) router.replace("/(tabs)/dashboard")` redirects too early, preventing baby creation.

**Step 1: Write a failing test for redirect behavior (if you have UI tests)**
- If there are existing component tests for screens, add one to assert:
  - with `isSignedIn=true`, `orgId` set, and `babies=[]`, the screen does **not** redirect to dashboard and shows `CreateBaby`.

**Step 2: Minimal implementation**
- Remove the unconditional redirect effect.
- Replace with a single redirect rule:
  - redirect to dashboard **only** when `isSignedIn && orgId && babies?.length > 0`
  - otherwise keep onboarding visible and show `CreateBaby` once org is active.

**Step 3: Manual verification**
- Create a new user with no org: you see org selection/creation.
- Create org: you see baby creation modal.
- After baby created: you land on dashboard.

### Task 2.2: Make org selection -> baby creation resilient

**Files:**
- Modify: `app/(auth)/onboarding.tsx`
- Inspect: `components/organisms/CreateBaby.tsx` (or index barrel)

**Step 1: Ensure `CreateBaby` is shown only when needed**
- If `babies` query returns `[]`, set `showCreateBaby=true`.
- If `babies` query returns `>0`, redirect dashboard.

**Step 2: Handle token refresh and transient “skip”**
- After `setActive`, call `getToken({ template: "convex", skipCache: true })`.
- Ensure `CreateBaby` is not shown until org is active and token is fetched.

---

## Phase 3: Sign-Out + Cache Clearing

### Task 3.1: Ensure sign-out clears local session state and cached data

**Files:**
- Modify: `components/providers/SecurityProvider.tsx`
- Inspect: any query cache provider (React Query client) location, e.g. `components/providers/**` or `app/_layout.tsx`

**Step 1: Identify caches to clear**
- React Query: `queryClient.clear()` (or `removeQueries()`), if used
- Any persisted storage (AsyncStorage/SecureStore) keys used for user-scoped state
- Any local app stores (Zustand) holding baby/org ids

**Step 2: Implement `clearSession` as “clear local state first, then signOut, then route”**
- On sign-out error, still clear local state and route to login.
- Avoid “data flash” by clearing query cache before navigation.

**Step 3: Add a regression test (best-effort)**
- If there are provider tests, ensure `clearSession()` invokes cache clearing and `signOut()`.

---

## Phase 4: Calendar Wiring Normalization

### Task 4.1: Normalize `appointments` and `medications` at the `CalendarView` boundary

**Files:**
- Modify: `app/(tabs)/calendar.tsx`
- Modify: `components/organisms/CalendarView.tsx` (only if needed)

**Step 1: Define a single “CalendarItem” shape locally (no backend refactor)**
- In `calendar.tsx`, map raw hook results into the exact `Appointment` / `Medication` interfaces expected by `CalendarView`.
- Ensure `date` is a stable `YYYY-MM-DD` string and time formatting is consistent.

**Step 2: Handle loading and empty states**
- If `isLoaded && orgId` but data is `undefined` (loading), show a loading indicator.
- If both are empty arrays, show a friendly empty state.

**Step 3: Manual verification**
- With no org selected: show “Please select a family…”
- With org selected: Calendar renders, no crashes if hooks return `undefined` briefly.

---

## Phase 5 (Optional): AI / Insight Work (Deferred)

### Task 5.1: Add rules-based “Daily Insight” stub (no LLM)

**Files:**
- Create: `lib/insights/rules.ts`
- Modify: `app/(tabs)/wellness.tsx`

**Step 1: Build deterministic insights**
- Based on most recent tracked data (sleep/feed frequency), return a short message.
- No network calls; no PHI export risk.

**Step 2: Add telemetry hooks later**
- Track dismiss/click-through so you can tune rules before introducing an LLM.

---

## Verification Checklist (end of each phase)

- Unit tests: `bun run test`
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Manual: onboarding (new user), org select, create baby, sign-out + sign-in as different user, calendar renders without flashes/crashes.


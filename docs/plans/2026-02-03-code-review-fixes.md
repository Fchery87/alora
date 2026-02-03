# Code Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement agreed fixes from the code review (logic, performance, and cleanup) and remove committed secrets from git history without rotating them yet.

**Architecture:** Apply targeted updates to Convex queries/mutations and client utilities, backed by unit tests. Then rewrite git history to purge `.env` and add ignores to prevent future commits.

**Tech Stack:** React Native + Expo, TypeScript, Convex, Vitest, Git.

### Task 1: Fix appointments update mutation

**Files:**
- Modify: `convex/functions/appointments/index.ts`
- Test: `__tests__/convex/appointments.test.ts`

**Step 1: Write failing test**

Add a test that calls `updateAppointment` and asserts `ctx.db.patch` receives sanitized fields.

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/convex/appointments.test.ts`
Expected: FAIL (patch not called / missing updates)

**Step 3: Implement minimal update logic**

Add `ctx.db.patch` with sanitized `title`, `location`, `notes`.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/convex/appointments.test.ts`
Expected: PASS

**Step 5: Commit**

Run:
```bash
git add convex/functions/appointments/index.ts __tests__/convex/appointments.test.ts
git commit -m "fix: apply appointment updates"
```

### Task 2: Make queries pure (no writes)

**Files:**
- Modify: `convex/functions/journal/index.ts`
- Modify: `convex/functions/wellness/index.ts`
- Modify: `convex/functions/insights/index.ts`
- Test: `__tests__/convex/*`

**Step 1: Write failing tests**

Update/extend tests to ensure queries call `requireUserId` rather than `requireMutationUserId`.

**Step 2: Run tests to verify they fail**

Run: `bun run test __tests__/convex`
Expected: FAIL where queries still use mutation user helper

**Step 3: Implement minimal changes**

Replace `requireMutationUserId` with `requireUserId` in query handlers.

**Step 4: Run tests to verify they pass**

Run: `bun run test __tests__/convex`
Expected: PASS

**Step 5: Commit**

Run:
```bash
git add convex/functions/journal/index.ts convex/functions/wellness/index.ts convex/functions/insights/index.ts __tests__/convex
git commit -m "fix: keep queries read-only"
```

### Task 3: Reduce unbounded reads in appointments/medications

**Files:**
- Modify: `convex/functions/appointments/index.ts`
- Modify: `convex/functions/medications/index.ts`
- Test: `__tests__/convex/appointments.test.ts` (and add meds test if needed)

**Step 1: Write failing test**

Add a test asserting query uses index + limit (no `collect()`).

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/convex`
Expected: FAIL (collect used)

**Step 3: Implement query pagination**

Use index queries + optional filters; default limit; return sorted results without full collect.

**Step 4: Run tests to verify they pass**

Run: `bun run test __tests__/convex`
Expected: PASS

**Step 5: Commit**

Run:
```bash
git add convex/functions/appointments/index.ts convex/functions/medications/index.ts __tests__/convex
git commit -m "perf: avoid unbounded collect"
```

### Task 4: Fix auto-lock cleanup

**Files:**
- Modify: `lib/security.ts`
- Test: `__tests__/lib/*` (create if missing)

**Step 1: Write failing test**

Add test to ensure teardown clears interval and listener.

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/lib`
Expected: FAIL

**Step 3: Implement teardown**

Add `teardownAutoLock` and store subscription handle.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/lib`
Expected: PASS

**Step 5: Commit**

Run:
```bash
git add lib/security.ts __tests__/lib
git commit -m "fix: cleanup auto-lock listeners"
```

### Task 5: Remove `.env` from git history (no rotation)

**Files:**
- Modify: `.gitignore`
- History rewrite: remove `.env`, `.env.local` from git history

**Step 1: Add ignores**

Update `.gitignore` to include `.env` and `.env.local`.

**Step 2: Rewrite history to purge secrets**

Run:
```bash
git filter-repo --path .env --path .env.local --invert-paths
```

**Step 3: Verify no secrets remain**

Run: `git grep -n "CLERK_SECRET_KEY\\|CLERK_WEBHOOK_SECRET\\|AUTH_SECRET" --all-history`
Expected: No matches

**Step 4: Commit**

Run:
```bash
git add .gitignore
git commit -m "chore: ignore env files and purge history"
```

**Step 5: Coordinate force-push**

Note: Requires force push and team coordination.

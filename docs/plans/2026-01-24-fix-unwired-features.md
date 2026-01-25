# Fix Unwired Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up missing or broken features (org scoping, calendar data, onboarding baby setup, profile consistency, family/settings navigation) so core flows work end-to-end.

**Architecture:** Keep Clerk organizations as the family boundary, enforce org scoping in Convex queries, and ensure onboarding creates an org and first baby. Use existing Convex functions and hooks, wiring UI screens to real data. Reduce duplicate/placeholder UI by consolidating profile to a single source of truth.

**Tech Stack:** Expo Router, Clerk Expo, Convex, React Native, Zustand.

---

### Task 1: Lock down users list to organization

**Files:**

- Modify: `convex/functions/users/index.ts`
- Modify: `convex/lib/users.ts` (if needed for org->user lookup helpers)
- Test: `__tests__/convex/users.test.ts` (new)

**Step 1: Write the failing test**

```ts
// __tests__/convex/users.test.ts
import { describe, it, expect } from "vitest";

// Pseudocode test setup; replace with your Convex test harness if available.
// Goal: list() only returns users in the same org.

describe("users.list", () => {
  it("returns only users in same org", async () => {
    const { ctx, runQuery } = await createConvexTestContext({ orgId: "orgA" });
    await seedUser({ clerkUserId: "u1", orgId: "orgA" });
    await seedUser({ clerkUserId: "u2", orgId: "orgB" });

    const users = await runQuery("functions/users/index:list", ctx);
    expect(users.map((u) => u.clerkUserId)).toEqual(["u1"]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: FAIL (list returns users from multiple orgs)

**Step 3: Write minimal implementation**

- Add an org field to user records OR map users to org via membership table if exists.
- If no org mapping exists, add `clerkOrganizationId` to `users` schema and backfill via webhook or on-demand.
- Update `list` to filter by org.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/convex/users.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add convex/functions/users/index.ts convex/lib/users.ts __tests__/convex/users.test.ts
git commit -m "fix(users): scope list to organization"
```

---

### Task 2: Fix SecurityProvider sign-out path

**Files:**

- Modify: `components/providers/SecurityProvider.tsx`
- Modify: `lib/clerk.tsx` (export a signOut helper) or refactor to use `useAuth`
- Test: `__tests__/security/signout.test.tsx` (new)

**Step 1: Write the failing test**

```tsx
// __tests__/security/signout.test.tsx
import { render } from "@testing-library/react-native";
import { SecurityProvider } from "@/components/providers/SecurityProvider";

it("does not throw when clearSession is called", async () => {
  const { getByTestId } = render(
    <SecurityProvider>
      <TestComponent />
    </SecurityProvider>
  );
  // ensure calling clearSession does not throw due to missing signOut
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/security/signout.test.tsx`
Expected: FAIL (missing signOut export)

**Step 3: Write minimal implementation**

- Export a `signOut` helper from `lib/clerk.tsx` that uses Clerk instance.
- Or refactor `SecurityProvider` to accept a signOut function or use `useAuth` and call `signOut()`.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/security/signout.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/providers/SecurityProvider.tsx lib/clerk.tsx __tests__/security/signout.test.tsx
git commit -m "fix(security): wire sign out"
```

---

### Task 3: Wire calendar data to Convex hooks

**Files:**

- Modify: `app/(tabs)/calendar.tsx`
- Modify: `hooks/queries/useAppointments.ts`
- Modify: `hooks/queries/useMedications.ts`
- Modify: `components/organisms/CalendarView.tsx` (if new props needed)
- Test: `__tests__/calendar/CalendarScreen.test.tsx`

**Step 1: Write the failing test**

```tsx
// __tests__/calendar/CalendarScreen.test.tsx
import { render } from "@testing-library/react-native";
import CalendarScreen from "@/app/(tabs)/calendar";

it("passes appointments and medications into CalendarView", () => {
  // Mock hooks to return sample data
  // Assert CalendarView renders appointment markers
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/calendar/CalendarScreen.test.tsx`
Expected: FAIL (CalendarView receives no data)

**Step 3: Write minimal implementation**

- Use Clerk org id from auth/identity.
- Call `useAppointments` and `useMedications` and pass results into `CalendarView`.
- Add loading/empty states if needed.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/calendar/CalendarScreen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(tabs)/calendar.tsx hooks/queries/useAppointments.ts hooks/queries/useMedications.ts components/organisms/CalendarView.tsx __tests__/calendar/CalendarScreen.test.tsx
git commit -m "feat(calendar): wire appointments and medications"
```

---

### Task 4: Onboarding creates first baby after org selection

**Files:**

- Modify: `app/(auth)/onboarding.tsx`
- Modify: `components/organisms/CreateBaby.tsx` (if reusable)
- Modify: `hooks/useBaby.ts` (if needed)
- Test: `__tests__/auth/onboarding.test.tsx`

**Step 1: Write the failing test**

```tsx
// __tests__/auth/onboarding.test.tsx
import { render, fireEvent } from "@testing-library/react-native";
import OnboardingScreen from "@/app/(auth)/onboarding";

it("creates a baby and navigates to dashboard", async () => {
  // mock createOrganization + createBaby mutation
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/auth/onboarding.test.tsx`
Expected: FAIL (no baby creation)

**Step 3: Write minimal implementation**

- After org selection/creation, prompt for baby name/date.
- Use existing Convex mutation to create a baby.
- Navigate to `/(tabs)/dashboard` after success.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/auth/onboarding.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(auth)/onboarding.tsx components/organisms/CreateBaby.tsx hooks/useBaby.ts __tests__/auth/onboarding.test.tsx
git commit -m "feat(onboarding): create first baby"
```

---

### Task 5: Consolidate profile screens and wire to Clerk data

**Files:**

- Modify: `app/(tabs)/profile.tsx`
- Modify: `app/(tabs)/settings/profile/index.tsx`
- Modify: `app/(tabs)/settings/_layout.tsx` (if routing changes)
- Test: `__tests__/profile/ProfileScreen.test.tsx`

**Step 1: Write the failing test**

```tsx
// __tests__/profile/ProfileScreen.test.tsx
import { render } from "@testing-library/react-native";
import ProfileScreen from "@/app/(tabs)/profile";

it("renders current user name/email from Clerk", () => {
  // mock useUser to return user
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/profile/ProfileScreen.test.tsx`
Expected: FAIL (placeholder data or inconsistent UI)

**Step 3: Write minimal implementation**

- Choose one profile screen as source of truth (tabs profile).
- Either wire settings profile to read-only Clerk data or remove it.
- Ensure sign-out works from the selected screen.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/profile/ProfileScreen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(tabs)/profile.tsx app/(tabs)/settings/profile/index.tsx app/(tabs)/settings/_layout.tsx __tests__/profile/ProfileScreen.test.tsx
git commit -m "fix(profile): consolidate and wire to Clerk"
```

---

### Task 6: Add Family and Settings routes to navigation

**Files:**

- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(tabs)/family.tsx` (wire to data if feasible)
- Modify: `app/(tabs)/settings/_layout.tsx` (ensure reachable)
- Test: `__tests__/navigation/TabsLayout.test.tsx`

**Step 1: Write the failing test**

```tsx
// __tests__/navigation/TabsLayout.test.tsx
import { render } from "@testing-library/react-native";
import TabsLayout from "@/app/(tabs)/_layout";

it("includes Family and Settings routes", () => {
  // assert route config contains family/settings
});
```

**Step 2: Run test to verify it fails**

Run: `bun run test __tests__/navigation/TabsLayout.test.tsx`
Expected: FAIL (routes missing)

**Step 3: Write minimal implementation**

- Add `family` and `settings` tabs or entry points.
- If settings should be nested, add a visible entry in profile to push into settings.

**Step 4: Run test to verify it passes**

Run: `bun run test __tests__/navigation/TabsLayout.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(tabs)/_layout.tsx app/(tabs)/family.tsx app/(tabs)/settings/_layout.tsx __tests__/navigation/TabsLayout.test.tsx
git commit -m "feat(nav): expose family and settings"
```

---

Plan complete and saved to `docs/plans/2026-01-24-fix-unwired-features.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?

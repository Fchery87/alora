# ESLint Warnings Reduction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce the noisiest ESLint warnings without changing runtime behavior.

**Architecture:** Mechanical refactors only: remove unused symbols, stabilize hook dependencies with `useCallback`/deps arrays, and extract inline styles to `StyleSheet.create`.

**Tech Stack:** Expo Router + React Native, TypeScript, ESLint (eslint-config-expo), Vitest.

### Task 1: Remove unused imports/variables in tests

**Files:**

- Modify: `__tests__/components/DiaperTracker.test.tsx`
- Modify: `__tests__/components/FeedCard.test.tsx`
- Modify: `__tests__/components/JournalEntryForm.test.tsx`
- Modify: `__tests__/components/MoodCheckIn.test.tsx`
- Modify: `__tests__/components/placeholder.test.tsx`
- Modify: `__tests__/hooks/useFeeds.test.ts`
- Modify: `__tests__/hooks/useSecurity.test.ts`
- Modify: `__tests__/lib/self-care.test.ts`

**Step 1:** Remove unused `render`, `React`, `vi`, `beforeEach`, and any other unused imports flagged by ESLint.

**Step 2:** Run `bun run lint` and confirm these warnings drop.

### Task 2: Fix unused imports in app/lib/hooks

**Files:**

- Modify: `hooks/usePushSync.ts`
- Modify: `lib/encryption.ts`
- Modify: `lib/token-cache.ts`

**Step 1:** Remove unused imports (e.g., `useAction`, `SHA256`, `SecureStore`) or wire them if actually needed.

**Step 2:** Run `bun run lint` and confirm these warnings drop.

### Task 3: Fix `react-hooks/exhaustive-deps` warnings (behavior-preserving)

**Files:**

- Modify: `app/(auth)/onboarding.tsx`
- Modify: any other file flagged during re-run

**Step 1:** For missing deps, prefer wrapping callbacks in `useCallback` and include stable deps rather than disabling rules.

**Step 2:** Re-run `bun run lint` to confirm warnings drop.

### Task 4: Remove `react-native/no-inline-styles` warnings in highest-noise screens

**Files:**

- Modify: `app/(auth)/onboarding.tsx`
- Modify: `lib/clerk.tsx`

**Step 1:** Replace inline style objects with `StyleSheet.create({ ... })` and reference by name.

**Step 2:** Re-run `bun run lint` to confirm warnings drop.

### Task 5: Verify nothing regressed

**Step 1:** Run `bun run typecheck` and expect success.

**Step 2:** Run `bunx vitest run` and expect all tests passing.

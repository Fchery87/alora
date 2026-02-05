# Care Journal Dashboard Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the Home/Dashboard experience to the Care Journal system (paper/ink/stamps/log rows) while keeping changes incremental and test-covered.

**Architecture:** Keep existing `lib/theme` and existing UI components intact. Update `Dashboard` (organism) and `DashboardScreen` to compose Care Journal components (`JournalScaffold`, `StampButton`, `LogRow`) and the Care Journal tokens. Avoid touching unrelated screens. Prefer additive props over breaking changes.

**Tech Stack:** Expo Router, React Native, Vitest + react-test-renderer harness, NativeWind/Tamagui existing.

---

## Task 1: Update `Dashboard` test to assert Care Journal structure

**Files:**
- Modify: `__tests__/components/Dashboard.test.tsx`

### Step 1: Write the failing test

Update expectations to match new content:
- “Today” visible
- “Stamps” section visible with at least “Feed”, “Diaper”, “Sleep”, “Check-in”
- “Today’s summary” (or equivalent) section visible
- “Recent entries” section visible

### Step 2: Run test to verify it fails

Run: `bun run test __tests__/components/Dashboard.test.tsx`  
Expected: FAIL (current component still uses old labels/layout)

---

## Task 2: Refactor `Dashboard` organism to use Care Journal components

**Files:**
- Modify: `components/organisms/Dashboard.tsx`

### Step 1: Implement minimal changes to pass updated tests

Use:
- `JournalScaffold` for the page container (title “Today”)
- `StampButton` for quick actions (labels “Feed”, “Diaper”, “Sleep”, “Check-in”)
- `LogRow` for a small Recent entries list when no `activityFeed` prop is provided

Keep existing props (`todayFeeds`, `todayDiapers`, `todaySleep`, `activityFeed`) intact.

### Step 2: Run test to verify it passes

Run: `bun run test __tests__/components/Dashboard.test.tsx`  
Expected: PASS

---

## Task 3: Update `DashboardScreen` to avoid double headers and match journal feel

**Files:**
- Modify: `app/(tabs)/dashboard.tsx`

### Step 1: Remove or soften the existing `Header` usage

Prefer `Dashboard` to own the journal header via `JournalScaffold`, so `DashboardScreen` doesn’t render a second header.

### Step 2: Run targeted tests for new Care Journal pieces

Run:
- `bun run test __tests__/components/Dashboard.test.tsx`
- `bun run test __tests__/components/careJournal/StampButton.test.tsx`

Expected: PASS

---

## Task 4: Add a follow-up “migration hook” (no behavior yet)

**Files:**
- Create: `components/care-journal/index.ts`

### Step 1: Export Care Journal components

Export `JournalScaffold`, `StampButton`, and `LogRow` so screens can migrate with consistent imports.

### Step 2: Run a quick TS check (optional if typecheck is blocked)

If repo-wide `bun run typecheck` is blocked, run:
- `bun run test __tests__/components/careJournal/JournalScaffold.test.tsx`

Expected: PASS


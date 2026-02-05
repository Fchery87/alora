# Care Journal Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an additive “Care Journal” design system (tokens + core components) without breaking existing UI, so we can migrate screens incrementally.

**Architecture:** New modules live under `lib/design/` and `components/care-journal/`. Existing `lib/theme` and existing components remain untouched initially. New components consume tokens directly and use the new font families once loaded.

**Tech Stack:** Expo Router, React Native, NativeWind/Tamagui (existing), Vitest + react-test-renderer test harness.

---

## Task 1: Add Care Journal tokens module

**Files:**
- Create: `lib/design/careJournal/tokens.ts`
- Test: `__tests__/lib/careJournalTokens.test.ts`

### Step 1: Write the failing test

Create `__tests__/lib/careJournalTokens.test.ts` asserting:
- exports include `color.paper.base`, `color.ink.strong`, `color.pigment.clay`
- spacing scale contains `0,4,8,12,16,20,24,32,40,48`
- radius tokens include `sm,md,lg,xl`

### Step 2: Run test to verify it fails

Run: `bun run test __tests__/lib/careJournalTokens.test.ts`  
Expected: FAIL (module not found)

### Step 3: Write minimal implementation

Create `lib/design/careJournal/tokens.ts` exporting:
- `color`, `space`, `radius`, `shadow`, `typeScale`

### Step 4: Run test to verify it passes

Run: `bun run test __tests__/lib/careJournalTokens.test.ts`  
Expected: PASS

---

## Task 2: Add `JournalScaffold`

**Files:**
- Create: `components/care-journal/JournalScaffold.tsx`
- Test: `__tests__/components/careJournal/JournalScaffold.test.tsx`

### Step 1: Write the failing test

Test that `JournalScaffold` renders the provided `title` and children.

### Step 2: Run test to verify it fails

Run: `bun run test __tests__/components/careJournal/JournalScaffold.test.tsx`  
Expected: FAIL (module not found)

### Step 3: Write minimal implementation

Implement a paper background scaffold with a title header and content slot.

### Step 4: Run test to verify it passes

Run: `bun run test __tests__/components/careJournal/JournalScaffold.test.tsx`  
Expected: PASS

---

## Task 3: Add `StampButton`

**Files:**
- Create: `components/care-journal/StampButton.tsx`
- Test: `__tests__/components/careJournal/StampButton.test.tsx`

### Step 1: Write the failing test

Test that:
- label renders
- press calls `onPress`
- `disabled` prevents press

### Step 2: Run test to verify it fails

Run: `bun run test __tests__/components/careJournal/StampButton.test.tsx`  
Expected: FAIL (module not found)

### Step 3: Write minimal implementation

Implement a 44px-min touch target button with label, optional icon slot, and active ring.

### Step 4: Run test to verify it passes

Run: `bun run test __tests__/components/careJournal/StampButton.test.tsx`  
Expected: PASS

---

## Task 4: Add `LogRow`

**Files:**
- Create: `components/care-journal/LogRow.tsx`
- Test: `__tests__/components/careJournal/LogRow.test.tsx`

### Step 1: Write the failing test

Test that time/title/value render and that time uses `fontVariant: ["tabular-nums"]` (assert via props).

### Step 2: Run test to verify it fails

Run: `bun run test __tests__/components/careJournal/LogRow.test.tsx`  
Expected: FAIL (module not found)

### Step 3: Write minimal implementation

Implement the row layout with optional meta and visibility badge.

### Step 4: Run test to verify it passes

Run: `bun run test __tests__/components/careJournal/LogRow.test.tsx`  
Expected: PASS

---

## Task 5: Load new fonts (additive)

**Files:**
- Modify: `app/_layout.tsx`
- Modify (optional): `components/ui/Text.tsx` (if it centralizes font families)

### Step 1: Add new font dependencies

Add:
- `@expo-google-fonts/literata`
- `@expo-google-fonts/ibm-plex-sans`

### Step 2: Update font loading

Load new font families in `app/_layout.tsx` without removing existing fonts yet.

### Step 3: Verify app still boots

Run: `bun run typecheck` (or open app)  
Expected: no TS errors from font family names used by new components.

---

## Task 6: Add a small “Care Journal” demo usage

**Files:**
- Create: `app/(tabs)/care-journal.tsx` (or similar)
- Modify: `app/(tabs)/_layout.tsx` to add a hidden/dev route if needed

### Step 1: Implement a small screen

Use `JournalScaffold`, a row of 3 `StampButton`s, and a few `LogRow`s to validate the system in-app.

### Step 2: Verify targeted tests pass

Run:
- `bun run test __tests__/lib/careJournalTokens.test.ts`
- `bun run test __tests__/components/careJournal/StampButton.test.tsx`

Expected: PASS


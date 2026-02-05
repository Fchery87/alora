# Expo SDK 54 Upgrade Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Upgrade this app from Expo SDK 52 (`expo@52.x`) to Expo SDK 54 so it opens in the current Expo Go (SDK 54) on Android.

**Architecture:** Use Expo’s upgrade tooling (`expo upgrade` / `expo install`) to move to the SDK 54-compatible package set, then follow up with targeted config/code changes required by updated Expo modules and React Native.

**Tech Stack:** Expo, React Native, Expo Router, Bun, TypeScript.

---

### Task 1: Capture baseline + choose upgrade path

**Files:**
- None

**Step 1: Record current Expo SDK + RN versions**

Run: `cat package.json | rg -n "\"expo\"|\"react-native\"|\"expo-router\""`

Expected: `expo@52.0.49`, `react-native@0.79.0`.

**Step 2: Attempt the official upgrade**

Run: `bunx expo upgrade 54`

Expected: CLI proposes dependency changes for SDK 54.

If blocked (network / CLI error): proceed with the manual path in Task 2b.

---

### Task 2a: Apply automated SDK 54 dependency set (preferred)

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

**Step 1: Apply the upgrade prompt choices (keep defaults)**

Run: `bunx expo upgrade 54`

Expected: `package.json` changes for `expo`, `react-native`, and related `expo-*` packages.

**Step 2: Re-install**

Run: `bun install`

Expected: lockfile updates and successful install.

---

### Task 2b: Manual dependency bump (fallback if automated upgrade fails)

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

**Step 1: Use Expo’s SDK 54 versions**

Run: `bunx expo install --fix`

Expected: compatible versions are installed (Expo chooses exact versions).

**Step 2: Re-install**

Run: `bun install`

---

### Task 3: Address config/code changes required by SDK 54

**Files:**
- Modify: `app.config.js`
- Modify: `metro.config.js` (only if Metro breaks)
- Modify: any files flagged by TypeScript/Metro after upgrade

**Step 1: Start the dev server for Expo Go**

Run: `bun run start`

Expected: server starts without “Project is incompatible with this version of Expo Go”.

**Step 2: Fix runtime errors surfaced by Metro**

Run: `bunx expo start --go --lan`

Expected: QR renders; Metro bundling succeeds.

Apply minimal, targeted fixes for any module API changes (no refactors).

---

### Task 4: Verify upgrade locally

**Files:**
- None

**Step 1: Sanity-check TypeScript (best effort)**

Run: `bun run typecheck`

Expected: may still fail due to pre-existing Convex codegen issues; ensure no *new* SDK-related type failures are introduced if possible.

**Step 2: Confirm Expo Go compatibility message is gone**

Run: `bunx expo start --go --lan`

Expected: no SDK incompatibility error in logs.


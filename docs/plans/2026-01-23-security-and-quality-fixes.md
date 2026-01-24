# Security & Quality Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical security vulnerabilities, authentication bypass, and code quality issues in the Alora baby tracking app to achieve production-ready security standards.

**Architecture:** This plan addresses 7 critical security vulnerabilities (missing auth on 23 Convex functions, webhook signature verification, auth bypass), fixes app-breaking bugs (infinite recursion), resolves React hook dependency issues, and improves code quality through test fixes and dependency updates.

**Tech Stack:** React Native + Expo, Convex (backend), Clerk (auth), TypeScript, Vitest, Zustand

**Current State:**
- Validation Health Score: 62/100
- Critical Issues: 7 (blocking production)
- Test Status: 15 failing, 164 passing
- ESLint: 63 warnings
- Security: 24 npm vulnerabilities (3 critical, 10 high)

**Target State:**
- Validation Health Score: ≥95/100
- All tests passing (179/179)
- No critical/high security vulnerabilities
- All Convex functions authenticated
- No auth bypass mechanism

---

## Phase 1: CRITICAL APP-BREAKING BUGS (Execute First)

### Task 1.1: Fix ActivityIndicator Infinite Recursion

**Files:**
- Modify: `components/atoms/LoadingButton.tsx:44-52`

**Issue:** Component calls itself recursively causing stack overflow on render.

**Step 1: Read current implementation**

Run: `cat components/atoms/LoadingButton.tsx | grep -A 10 "export function ActivityIndicator"`

Expected: See recursive call on line 50

**Step 2: Fix the recursion**

In `components/atoms/LoadingButton.tsx`, modify lines 44-52:

```typescript
// BEFORE (BROKEN):
export function ActivityIndicator({ size = "small", color = "#6366f1" }: ActivityIndicatorProps) {
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator size={size} color={color} /> {/* RECURSION! */}
    </View>
  );
}

// AFTER (FIXED):
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

export function ActivityIndicator({ size = "small", color = "#6366f1" }: ActivityIndicatorProps) {
  return (
    <View style={styles.activityIndicator}>
      <RNActivityIndicator size={size} color={color} />
    </View>
  );
}
```

**Step 3: Verify no runtime errors**

Run: `bun run typecheck`
Expected: No TypeScript errors

**Step 4: Test the component**

Run: `bun run test __tests__/components/LoadingButton.test.tsx` (if exists)
Expected: Tests pass

**Step 5: Commit**

```bash
git add components/atoms/LoadingButton.tsx
git commit -m "fix(components): resolve ActivityIndicator infinite recursion

- Import RNActivityIndicator to avoid self-reference
- Fixes stack overflow crash on app load
- Critical app-breaking bug"
```

---

### Task 1.2: Fix React Hook Dependencies - useNotificationReminders

**Files:**
- Modify: `hooks/notifications/useNotificationReminders.ts:14`

**Issue:** `loadReminders` missing from useEffect dependencies causing stale closures.

**Step 1: Read current implementation**

Run: `cat hooks/notifications/useNotificationReminders.ts`

Expected: See `loadReminders` used in useEffect without being in deps array

**Step 2: Wrap loadReminders in useCallback**

In `hooks/notifications/useNotificationReminders.ts`, modify around line 10-20:

```typescript
// BEFORE:
const loadReminders = async () => {
  // ... existing logic
};

useEffect(() => {
  loadReminders();
}, [babyId]); // Missing: loadReminders

// AFTER:
const loadReminders = useCallback(async () => {
  // ... existing logic (keep same)
}, [babyId, /* add other dependencies used inside loadReminders */]);

useEffect(() => {
  loadReminders();
}, [loadReminders]); // Now includes loadReminders
```

**Step 3: Run ESLint to verify**

Run: `bun run lint hooks/notifications/useNotificationReminders.ts`
Expected: No "exhaustive-deps" warning

**Step 4: Test the hook**

Run: `bun run test __tests__/hooks/notifications/useNotificationReminders.test.tsx`
Expected: All tests pass

**Step 5: Commit**

```bash
git add hooks/notifications/useNotificationReminders.ts
git commit -m "fix(hooks): add loadReminders to useEffect dependencies

- Wrap loadReminders in useCallback with proper deps
- Fixes stale closure issue
- Resolves ESLint exhaustive-deps warning"
```

---

### Task 1.3: Fix React Hook Dependencies - useBaby

**Files:**
- Modify: `hooks/useBaby.ts:33-43`

**Issue:** Unstable `actions` reference from Zustand causes infinite re-renders.

**Step 1: Read current implementation**

Run: `cat hooks/useBaby.ts | grep -A 15 "useEffect"`

Expected: See `actions` in dependency array from Zustand selector

**Step 2: Fix unstable reference**

In `hooks/useBaby.ts`, modify around lines 28-45:

```typescript
// BEFORE (causes infinite loops):
const { selectedBabyId, babies, actions } = useBabyStore();

useEffect(() => {
  if (fetchedBabies && Array.isArray(fetchedBabies)) {
    actions.setBabies(fetchedBabies);
    if (!selectedBabyId && fetchedBabies.length > 0) {
      actions.selectBaby(fetchedBabies[0]._id);
    }
  }
}, [fetchedBabies, selectedBabyId, actions]); // 'actions' recreated every render!

// AFTER (stable):
const selectedBabyId = useBabyStore((state) => state.selectedBabyId);
const babies = useBabyStore((state) => state.babies);

useEffect(() => {
  if (fetchedBabies && Array.isArray(fetchedBabies)) {
    // Access actions directly from store to avoid dependency
    useBabyStore.getState().actions.setBabies(fetchedBabies);
    if (!selectedBabyId && fetchedBabies.length > 0) {
      useBabyStore.getState().actions.selectBaby(fetchedBabies[0]._id);
    }
  }
}, [fetchedBabies, selectedBabyId]); // No 'actions' dependency
```

**Step 3: Verify no infinite loops**

Run: `bun run lint hooks/useBaby.ts`
Expected: No warnings

**Step 4: Test the hook**

Run: `bun run test __tests__/hooks/useBaby.test.tsx` (if exists)
Expected: Tests complete without timeout

**Step 5: Commit**

```bash
git add hooks/useBaby.ts
git commit -m "fix(hooks): prevent infinite loop in useBaby

- Access actions via getState() instead of hook selector
- Removes unstable actions reference from deps
- Fixes infinite re-render issue"
```

---

### Task 1.4: Fix React Hook Dependencies - Toast

**Files:**
- Modify: `components/atoms/Toast.tsx:62-72`

**Issue:** `hideToast` missing from `showToast` callback dependencies.

**Step 1: Read current implementation**

Run: `cat components/atoms/Toast.tsx | grep -A 15 "const showToast"`

Expected: See `hideToast` used in setTimeout without being in deps

**Step 2: Add hideToast to dependencies**

In `components/atoms/Toast.tsx`, modify around line 62-72:

```typescript
// BEFORE:
const showToast = React.useCallback((options: ToastOptions) => {
  const id = Math.random().toString();
  setToasts((prev) => [...prev, { ...options, id }]);

  setTimeout(() => {
    hideToast(id); // hideToast not in deps!
  }, options.duration ?? 3000);
}, []); // Missing: hideToast

// AFTER:
const showToast = React.useCallback((options: ToastOptions) => {
  const id = Math.random().toString();
  setToasts((prev) => [...prev, { ...options, id }]);

  setTimeout(() => {
    hideToast(id);
  }, options.duration ?? 3000);
}, [hideToast]); // Now includes hideToast
```

**Step 3: Verify no warnings**

Run: `bun run lint components/atoms/Toast.tsx`
Expected: No "exhaustive-deps" warning

**Step 4: Test toasts still work**

Run: `bun run test __tests__/components/Toast.test.tsx` (if exists)
Expected: All toast tests pass

**Step 5: Commit**

```bash
git add components/atoms/Toast.tsx
git commit -m "fix(components): add hideToast to showToast dependencies

- Fixes stale closure in toast timeout
- Resolves ESLint exhaustive-deps warning
- Ensures correct toast dismissal"
```

---

## Phase 2: CRITICAL SECURITY - Authentication

### Task 2.1: Install Webhook Signature Verification Package

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

**Step 1: Install svix package**

Run: `bun add svix`

Expected: Package added to dependencies

**Step 2: Verify installation**

Run: `bun run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "build(deps): add svix for webhook signature verification

- Required for Clerk webhook security
- Prevents forged webhook requests"
```

---

### Task 2.2: Implement Webhook Signature Verification

**Files:**
- Modify: `convex/functions/webhooks/clerk.ts:1-10` (imports)
- Modify: `convex/functions/webhooks/clerk.ts:40-50` (verification logic)

**Step 1: Read current webhook handler**

Run: `cat convex/functions/webhooks/clerk.ts | head -60`

Expected: See TODO comment about SVIX signature verification

**Step 2: Add SVIX import and verification**

In `convex/functions/webhooks/clerk.ts`, add at top:

```typescript
import { Webhook } from 'svix';
```

Then replace lines 40-50 (the TODO section):

```typescript
// BEFORE (INSECURE):
// Note: In production, you'd verify the signature here using SVIX
// For now, we'll proceed with the event data

// AFTER (SECURE):
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error('CLERK_WEBHOOK_SECRET not configured');
  return new Response('Webhook secret not configured', { status: 500 });
}

const svixId = request.headers.get('svix-id');
const svixTimestamp = request.headers.get('svix-timestamp');
const svixSignature = request.headers.get('svix-signature');

if (!svixId || !svixTimestamp || !svixSignature) {
  console.error('Missing svix headers');
  return new Response('Missing svix headers', { status: 400 });
}

const body = await request.text();

const wh = new Webhook(webhookSecret);
let payload;

try {
  payload = wh.verify(body, {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  }) as any;
} catch (err) {
  console.error('Webhook signature verification failed:', err);
  return new Response('Invalid signature', { status: 401 });
}

// Continue with existing event handling using 'payload' instead of raw body
const { type, data } = payload;
```

**Step 3: Update Convex environment variables**

Run: Open Convex Dashboard → Settings → Environment Variables → Add `CLERK_WEBHOOK_SECRET`

Get secret from: Clerk Dashboard → Webhooks → Signing Secret

**Step 4: Test webhook with valid signature**

Run: Use Clerk Dashboard "Send Test Event" button

Expected: Webhook processes successfully (check Convex logs)

**Step 5: Test webhook with invalid signature**

Run: `curl -X POST <webhook-url> -H "Content-Type: application/json" -d '{"type":"test"}' `

Expected: Returns 401 Invalid signature

**Step 6: Commit**

```bash
git add convex/functions/webhooks/clerk.ts
git commit -m "feat(security): implement webhook signature verification

- Add SVIX signature validation for Clerk webhooks
- Prevents forged webhook requests
- Returns 401 on invalid signatures
- CRITICAL security fix"
```

---

### Task 2.3: Add Authentication to Milestones Functions

**Files:**
- Modify: `convex/functions/milestones/index.ts:1-10` (imports)
- Modify: `convex/functions/milestones/index.ts:15-200` (all 6 functions)

**Step 1: Read current implementation**

Run: `cat convex/functions/milestones/index.ts | head -50`

Expected: See functions without auth checks

**Step 2: Add auth helper imports**

In `convex/functions/milestones/index.ts`, add at top after other imports:

```typescript
import { requireUserId, requireBabyAccess } from "../../lib/users";
```

**Step 3: Add auth to list() function**

Modify the `list` export (around line 15):

```typescript
// BEFORE (NO AUTH):
export const list = query({
  args: { babyId: v.id("babies") },
  handler: async (ctx, { babyId }) => {
    return await ctx.db
      .query("milestones")
      .withIndex("by_baby", (q) => q.eq("babyId", babyId))
      .collect();
  },
});

// AFTER (WITH AUTH):
export const list = query({
  args: { babyId: v.id("babies") },
  handler: async (ctx, { babyId }) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, babyId);

    return await ctx.db
      .query("milestones")
      .withIndex("by_baby", (q) => q.eq("babyId", babyId))
      .collect();
  },
});
```

**Step 4: Add auth to get() function**

Modify the `get` export:

```typescript
// BEFORE (NO AUTH):
export const get = query({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// AFTER (WITH AUTH):
export const get = query({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(id);
    if (!milestone) throw new Error("Milestone not found");

    // Verify user has access to this baby's milestones
    await requireBabyAccess(ctx, milestone.babyId);

    return milestone;
  },
});
```

**Step 5: Add auth to create() function**

Modify the `create` mutation:

```typescript
// BEFORE (NO AUTH):
export const create = mutation({
  args: {
    babyId: v.id("babies"),
    category: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    achievedAt: v.optional(v.number()),
    // ... other args
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("milestones", {
      ...args,
      createdAt: Date.now(),
      celebrated: false,
    });
  },
});

// AFTER (WITH AUTH):
export const create = mutation({
  args: {
    babyId: v.id("babies"),
    category: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    achievedAt: v.optional(v.number()),
    // ... other args
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await requireBabyAccess(ctx, args.babyId);

    return await ctx.db.insert("milestones", {
      ...args,
      createdById: userId,
      createdAt: Date.now(),
      celebrated: false,
    });
  },
});
```

**Step 6: Add auth to update() function**

Modify the `update` mutation:

```typescript
// BEFORE (NO AUTH):
export const update = mutation({
  args: {
    id: v.id("milestones"),
    // ... update fields
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Milestone not found");

    await ctx.db.patch(id, updates);
  },
});

// AFTER (WITH AUTH):
export const update = mutation({
  args: {
    id: v.id("milestones"),
    // ... update fields
  },
  handler: async (ctx, { id, ...updates }) => {
    const userId = await requireUserId(ctx);

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, existing.babyId);

    await ctx.db.patch(id, updates);
  },
});
```

**Step 7: Add auth to remove() function**

Modify the `remove` mutation:

```typescript
// BEFORE (NO AUTH):
export const remove = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// AFTER (WITH AUTH):
export const remove = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(id);
    if (!milestone) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, milestone.babyId);

    await ctx.db.delete(id);
  },
});
```

**Step 8: Add auth to celebrate() function**

Modify the `celebrate` mutation:

```typescript
// BEFORE (NO AUTH):
export const celebrate = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { celebrated: true });
  },
});

// AFTER (WITH AUTH):
export const celebrate = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);

    const milestone = await ctx.db.get(id);
    if (!milestone) throw new Error("Milestone not found");

    await requireBabyAccess(ctx, milestone.babyId);

    await ctx.db.patch(id, { celebrated: true });
  },
});
```

**Step 9: Test unauthenticated request fails**

Run: Use Convex dashboard or test client to call `milestones.list` without auth

Expected: Returns 401 "Unauthorized" error

**Step 10: Test authenticated request succeeds**

Run: Use app or test client with valid Clerk session

Expected: Returns milestones data

**Step 11: Commit**

```bash
git add convex/functions/milestones/index.ts
git commit -m "feat(security): add authentication to all milestone functions

- Require userId for all operations
- Verify baby access before read/write
- Add createdById tracking
- Fixes critical security vulnerability (unauthenticated access)"
```

---

### Task 2.4: Add Authentication to Reminders Functions

**Files:**
- Modify: `convex/functions/reminders/index.ts`

**Step 1: Add auth imports**

```typescript
import { requireUserId, requireBabyAccess } from "../../lib/users";
```

**Step 2-8: Add auth to all 7 functions**

Apply same pattern as Task 2.3 to:
- `list` (query)
- `getByUser` (query) - IMPORTANT: Verify requested userId matches authenticated user
- `get` (query)
- `create` (mutation)
- `update` (mutation)
- `toggleEnabled` (mutation)
- `remove` (mutation)

**Special case for getByUser:**

```typescript
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId: requestedUserId }) => {
    const authenticatedUserId = await requireUserId(ctx);

    // User can only access their own reminders
    if (authenticatedUserId !== requestedUserId) {
      throw new Error("Not authorized to view reminders for this user");
    }

    return await ctx.db
      .query("reminders")
      .withIndex("by_user", (q) => q.eq("userId", requestedUserId))
      .collect();
  },
});
```

**Step 9: Test**

Run: Test unauthenticated access fails, authenticated access succeeds

**Step 10: Commit**

```bash
git add convex/functions/reminders/index.ts
git commit -m "feat(security): add authentication to all reminder functions

- Require userId for all operations
- Verify user can only access own reminders
- Verify baby access where applicable
- Fixes critical security vulnerability"
```

---

### Task 2.5: Add Authentication to Appointments Functions

**Files:**
- Modify: `convex/functions/appointments/index.ts`

**Step 1: Add auth imports**

```typescript
import { requireOrganizationId } from "../../lib/users";
```

**Step 2: Add auth to listAppointments**

```typescript
export const listAppointments = query({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, { clerkOrganizationId }) => {
    const userOrgId = await requireOrganizationId(ctx);

    // Verify user's org matches requested org (HIPAA compliance)
    if (userOrgId !== clerkOrganizationId) {
      throw new Error("Not authorized to view appointments for this organization");
    }

    const family = await ctx.db
      .query("families")
      .withIndex("by_clerk_org", (q) => q.eq("clerkOrganizationId", clerkOrganizationId))
      .first();

    if (!family) throw new Error("Family not found");

    return await ctx.db
      .query("appointments")
      .withIndex("by_family", (q) => q.eq("familyId", family._id))
      .collect();
  },
});
```

**Step 3-7: Add auth to remaining functions**

Apply same org verification pattern to:
- `getAppointment`
- `createAppointment`
- `updateAppointment`
- `deleteAppointment`
- `completeAppointment`

**Step 8: Test org isolation**

Run: Verify User A from Org 1 cannot access Org 2's appointments

**Step 9: Commit**

```bash
git add convex/functions/appointments/index.ts
git commit -m "feat(security): add authentication to all appointment functions

- Require organization membership for all operations
- Verify org ID matches user's org (HIPAA compliance)
- Prevents cross-organization data access
- Fixes critical security vulnerability"
```

---

### Task 2.6: Add Authentication to Medications Functions

**Files:**
- Modify: `convex/functions/medications/index.ts`

**Step 1-9: Apply same pattern as Task 2.5**

Add organization-level auth to all 5 functions:
- `listMedications`
- `getMedication`
- `createMedication`
- `updateMedication`
- `deleteMedication`
- `toggleMedicationActive`

**Step 10: Commit**

```bash
git add convex/functions/medications/index.ts
git commit -m "feat(security): add authentication to all medication functions

- Require organization membership for all operations
- Verify org ID matches user's org (HIPAA compliance)
- Prevents unauthorized medication data access
- Fixes critical security vulnerability"
```

---

### Task 2.7: Add Authentication to Families Functions

**Files:**
- Modify: `convex/functions/families/index.ts`

**Step 1: Add auth to get() function**

```typescript
export const get = query({
  args: { id: v.id("families") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);

    const family = await ctx.db.get(id);
    if (!family) throw new Error("Family not found");

    // Verify user belongs to this family
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", userId))
      .first();

    if (user?.familyId !== id) {
      throw new Error("Not authorized to view this family");
    }

    return family;
  },
});
```

**Step 2: Add auth to getByClerkOrganizationId()**

```typescript
export const getByClerkOrganizationId = query({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, { clerkOrganizationId }) => {
    const userOrgId = await requireOrganizationId(ctx);

    if (userOrgId !== clerkOrganizationId) {
      throw new Error("Not authorized to view this organization");
    }

    return await ctx.db
      .query("families")
      .withIndex("by_clerk_org", (q) => q.eq("clerkOrganizationId", clerkOrganizationId))
      .first();
  },
});
```

**Step 3: Test**

Run: Verify users can only access their own family data

**Step 4: Commit**

```bash
git add convex/functions/families/index.ts
git commit -m "feat(security): add authentication to family query functions

- Require userId for get() operation
- Verify org membership for getByClerkOrganizationId()
- Prevents unauthorized family data access
- Fixes security vulnerability"
```

---

## Phase 3: CRITICAL SECURITY - Remove Auth Bypass

### Task 3.1: Remove Auth Bypass from Environment

**Files:**
- Delete: `lib/auth-bypass.ts`
- Modify: `app/index.tsx`
- Modify: `.env.local`

**Step 1: Delete auth bypass file**

Run: `git rm lib/auth-bypass.ts`

Expected: File removed

**Step 2: Remove auth bypass from app entry**

In `app/index.tsx`, find and remove the bypass logic:

```typescript
// REMOVE THESE LINES:
import { isAuthBypassed } from "@/lib/auth-bypass";
const authBypass = process.env.EXPO_PUBLIC_AUTH_BYPASS === "true";

// BEFORE:
if (isSignedIn || authBypass) {
  return <Redirect href="/(tabs)/dashboard" />;
}

// AFTER:
if (isSignedIn) {
  return <Redirect href="/(tabs)/dashboard" />;
}
```

**Step 3: Remove from environment file**

Run: `grep -v "EXPO_PUBLIC_AUTH_BYPASS" .env.local > .env.local.tmp && mv .env.local.tmp .env.local`

**Step 4: Verify auth required**

Run: Start app without signing in

Expected: Cannot access dashboard without authentication

**Step 5: Commit**

```bash
git add lib/auth-bypass.ts app/index.tsx .env.local
git commit -m "feat(security): remove authentication bypass mechanism

- Delete auth-bypass.ts file
- Remove bypass check from app entry
- Remove EXPO_PUBLIC_AUTH_BYPASS env var
- Fixes critical security vulnerability (auth bypass)"
```

---

## Phase 4: SECURITY - Secrets & Session

### Task 4.1: Migrate Session Lock to SecureStore

**Files:**
- Modify: `lib/session-lock.ts`

**Step 1: Read current implementation**

Run: `cat lib/session-lock.ts`

Expected: See AsyncStorage usage

**Step 2: Replace AsyncStorage with SecureStore**

In `lib/session-lock.ts`:

```typescript
// BEFORE:
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_LOCK_KEY = "alora-session-locked";

export async function lockSession() {
  await AsyncStorage.setItem(SESSION_LOCK_KEY, "true");
}

export async function isSessionLocked(): Promise<boolean> {
  const locked = await AsyncStorage.getItem(SESSION_LOCK_KEY);
  return locked === "true";
}

export async function unlockSession() {
  await AsyncStorage.removeItem(SESSION_LOCK_KEY);
}

// AFTER:
import * as SecureStore from 'expo-secure-store';

const SESSION_LOCK_KEY = "alora-session-locked";

export async function lockSession() {
  await SecureStore.setItemAsync(SESSION_LOCK_KEY, "true");
}

export async function isSessionLocked(): Promise<boolean> {
  const locked = await SecureStore.getItemAsync(SESSION_LOCK_KEY);
  return locked === "true";
}

export async function unlockSession() {
  await SecureStore.deleteItemAsync(SESSION_LOCK_KEY);
}
```

**Step 3: Test session lock**

Run: Test app session lock/unlock functionality

Expected: Session state persists securely

**Step 4: Commit**

```bash
git add lib/session-lock.ts
git commit -m "feat(security): migrate session lock to SecureStore

- Replace AsyncStorage with expo-secure-store
- Encrypts session lock state
- Prevents reading lock state via ADB on Android
- Improves security on rooted/jailbroken devices"
```

---

### Task 4.2: Rotate Exposed Secrets (MANUAL STEP)

**Files:**
- External: Clerk Dashboard
- External: Convex Dashboard
- Modify: `.env` (local only, DO NOT COMMIT)

**Step 1: Generate new auth secret**

Run: `openssl rand -hex 32`

Expected: 64-character hex string

**Step 2: Update Clerk secret key**

1. Open Clerk Dashboard → API Keys
2. Rotate Secret Key
3. Copy new secret key

**Step 3: Update Convex environment variables**

1. Open Convex Dashboard → Settings → Environment Variables
2. Update `CLERK_SECRET_KEY` with new value
3. Add `CLERK_WEBHOOK_SECRET` from Clerk Dashboard → Webhooks → Signing Secret

**Step 4: Update local .env (DO NOT COMMIT)**

Edit `.env` locally:
```bash
CLERK_SECRET_KEY=sk_test_NEW_VALUE_HERE
AUTH_SECRET=NEW_64_CHAR_HEX_HERE
```

**Step 5: Verify old secrets removed from git history**

Run: `git log --all --full-history --source --find-copies-harder -- .env .env.local .env.backup`

Expected: If secrets found in history, use BFG Repo-Cleaner to remove

**Step 6: Test with new secrets**

Run: `bun run start` and test authentication

Expected: App authenticates successfully with new secrets

**Step 7: Document (no code commit needed)**

Create note in team docs: "Secrets rotated on 2026-01-23, old keys revoked"

---

## Phase 5: CODE QUALITY - Tests & Dependencies

### Task 5.1: Fix Test Setup - Add ToastProvider

**Files:**
- Modify: `__tests__/setup.ts`

**Step 1: Read current test setup**

Run: `cat __tests__/setup.ts`

Expected: See basic test setup without ToastProvider

**Step 2: Add ToastProvider to test wrapper**

In `__tests__/setup.ts`, add:

```typescript
import { ToastProvider } from '@/components/atoms/Toast';

// Find or create test wrapper function
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

**Step 3: Update test imports to use wrapper**

In affected test files, wrap renders:

```typescript
// In __tests__/components/JournalEntryForm.test.tsx:
import { TestWrapper } from '../setup';

render(
  <TestWrapper>
    <JournalEntryForm />
  </TestWrapper>
);
```

**Step 4: Run failing tests**

Run: `bun run test __tests__/components/JournalEntryForm.test.tsx __tests__/components/MoodCheckIn.test.tsx`

Expected: All 15 previously failing tests now pass

**Step 5: Run full test suite**

Run: `bun run test --run`

Expected: 179/179 tests passing

**Step 6: Commit**

```bash
git add __tests__/setup.ts __tests__/components/JournalEntryForm.test.tsx __tests__/components/MoodCheckIn.test.tsx
git commit -m "fix(tests): add ToastProvider to test setup

- Wrap test components in ToastProvider
- Fixes 15 failing tests in JournalEntryForm and MoodCheckIn
- All tests now passing (179/179)"
```

---

### Task 5.2: Update Vulnerable Dependencies

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

**Step 1: Check current vulnerabilities**

Run: `bun audit`

Expected: 24 vulnerabilities (3 critical, 10 high, 8 moderate, 3 low)

**Step 2: Update critical packages**

Run:
```bash
bun update expo-router@3.5.24
bun update expo-notifications@0.32.16
bun update expo-splash-screen@31.0.13
bun update convex@1.31.6
bun update @vitejs/plugin-react@4.7.0
bun update vitest@4.0.18
bun update bun@1.3.6
```

**Step 3: Verify vulnerabilities reduced**

Run: `bun audit`

Expected: <5 vulnerabilities, 0 critical, 0 high

**Step 4: Run tests to verify no breaking changes**

Run: `bun run test --run`

Expected: All tests still pass

**Step 5: Run typecheck**

Run: `bun run typecheck`

Expected: No TypeScript errors

**Step 6: Test app builds**

Run: `bun run start` and verify app loads

Expected: App starts without errors

**Step 7: Commit**

```bash
git add package.json bun.lock
git commit -m "build(deps): update vulnerable dependencies

- Update expo-router (fixes XSS, path traversal)
- Update expo-notifications (security patches)
- Update bun (fixes prototype pollution)
- Update convex, vitest, vite plugin
- Reduces vulnerabilities from 24 to <5
- 0 critical/high vulnerabilities remaining"
```

---

## Phase 6: CODE QUALITY - Schema & Functions

### Task 6.1: Fix Schema Duplicate in Sleep Quality

**Files:**
- Modify: `convex/schema.ts:94-100`

**Step 1: Locate duplicate**

Run: `cat convex/schema.ts | grep -A 6 "quality:"`

Expected: See duplicate "awake" value

**Step 2: Remove duplicate**

In `convex/schema.ts`, modify around lines 94-100:

```typescript
// BEFORE:
quality: v.union(
  v.literal("awake"),
  v.literal("drowsy"),
  v.literal("sleeping"),
  v.literal("deep"),
  v.literal("awake")  // DUPLICATE
)

// AFTER:
quality: v.union(
  v.literal("awake"),
  v.literal("drowsy"),
  v.literal("sleeping"),
  v.literal("deep")
)
```

**Step 3: Verify schema valid**

Run: `bun run convex dev` (or `npx convex dev`)

Expected: No schema errors

**Step 4: Commit**

```bash
git add convex/schema.ts
git commit -m "fix(schema): remove duplicate 'awake' value in sleep quality

- Sleep quality union had duplicate 'awake' literal
- Fixes schema validation issue
- No breaking changes to existing data"
```

---

### Task 6.2: Implement users.list() Function

**Files:**
- Modify: `convex/functions/users/index.ts:26-27`

**Step 1: Read current TODO**

Run: `cat convex/functions/users/index.ts | grep -A 5 "TODO"`

Expected: See empty list function with TODO comment

**Step 2: Implement family member listing**

In `convex/functions/users/index.ts`, replace the TODO:

```typescript
// BEFORE:
export const list = query({
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    // TODO: Return users from the same organization/family
    return [];
  },
});

// AFTER:
export const list = query({
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", userId))
      .first();

    if (!user?.familyId) return [];

    return await ctx.db
      .query("users")
      .withIndex("by_family", (q) => q.eq("familyId", user.familyId))
      .collect();
  },
});
```

**Step 3: Test the function**

Run: Use Convex dashboard to call `users.list()`

Expected: Returns users from same family

**Step 4: Commit**

```bash
git add convex/functions/users/index.ts
git commit -m "feat(users): implement list() function for family members

- Returns users from same family as authenticated user
- Proper authorization checks
- Removes TODO placeholder"
```

---

## Phase 7: CLEANUP - ESLint & Unused Code

### Task 7.1: Auto-fix ESLint Warnings

**Files:**
- Multiple files with unused imports and inline styles

**Step 1: Check current warnings**

Run: `bun run lint | head -100`

Expected: 63 warnings

**Step 2: Auto-fix safe warnings**

Run: `bun run lint:fix`

Expected: Many warnings auto-fixed (unused imports, etc.)

**Step 3: Verify remaining warnings**

Run: `bun run lint | wc -l`

Expected: <20 warnings (mostly inline-styles which need manual fix)

**Step 4: Verify no broken code**

Run: `bun run typecheck && bun run test --run`

Expected: All pass

**Step 5: Commit**

```bash
git add -A
git commit -m "style: auto-fix ESLint warnings

- Remove unused imports
- Fix formatting issues
- Reduces warnings from 63 to <20
- Remaining warnings are inline-styles (manual fix needed)"
```

---

### Task 7.2: Remove Dead Code (Optional)

**Files:**
- Delete: `convex/functions/users/sync.ts` (if confirmed unused)
- Delete: `convex/functions/families/sync.ts` (if confirmed unused)

**Step 1: Verify files are unused**

Run: `grep -r "from.*users/sync" .`
Run: `grep -r "from.*families/sync" .`

Expected: No imports found

**Step 2: Verify webhooks handle sync**

Run: Check that `convex/functions/webhooks/` has equivalent functionality

Expected: Webhooks handle all user/family creation and updates

**Step 3: Delete files**

Run:
```bash
git rm convex/functions/users/sync.ts
git rm convex/functions/families/sync.ts
```

**Step 4: Verify build succeeds**

Run: `bun run typecheck`

Expected: No errors

**Step 5: Commit**

```bash
git commit -m "refactor: remove unused sync.ts files

- users/sync.ts superseded by webhook handlers
- families/sync.ts superseded by webhook handlers
- No breaking changes
- Reduces code maintenance burden"
```

---

## Verification & Testing

### Final Verification Checklist

After completing all tasks, run these commands to verify:

**1. Type Safety**
```bash
bun run typecheck
```
Expected: 0 errors

**2. Linting**
```bash
bun run lint
```
Expected: <10 warnings

**3. Tests**
```bash
bun run test --run
```
Expected: 179/179 passing

**4. Security Audit**
```bash
bun audit
```
Expected: <5 vulnerabilities, 0 critical, 0 high

**5. Build**
```bash
bun run start
```
Expected: App starts without errors

**6. Authentication Test**
- Try accessing app without login → Should redirect to auth
- Try accessing milestones without baby access → Should fail with 401
- Try accessing another org's appointments → Should fail with 401

**7. Webhook Test**
- Send test webhook from Clerk with valid signature → Success
- Send webhook with invalid signature → 401 error

### Success Criteria

✅ All tasks completed
✅ Validation Health Score ≥95/100
✅ All tests passing (179/179)
✅ No critical/high vulnerabilities
✅ All Convex functions authenticated
✅ Webhook signatures verified
✅ Auth bypass removed
✅ No app-breaking bugs
✅ ESLint warnings <10

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-01-23-security-and-quality-fixes.md`.**

### Two execution options:

**1. Subagent-Driven (this session)**
- Stay in this session
- I dispatch a fresh subagent per task
- Code review between tasks
- Fast iteration
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development

**2. Parallel Session (separate)**
- Open new Claude session
- Batch execution with checkpoints
- Review at phase boundaries
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans

**Which approach would you like to use?**

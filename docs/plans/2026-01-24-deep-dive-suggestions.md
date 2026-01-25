# Alora Project Deep Dive & Enhancement Plan

This plan addresses existing gaps in the Alora parenting app ("unwired" features) and proposes strategic enhancements to strengthen the product based on industry research.

## User Review Required

> [!IMPORTANT] > **AI Usage Strategy**: I propose adding an LLM-powered "Daily Insight" feature. This will require a Convex action and an LLM API key (e.g., OpenAI/Gemini) if not already configured.
>
> **Push Notifications**: Full push notification integration is missing and suggested for MVP reach, but requires Expo push tokens and server-side logic.

## Proposed Changes

### 1. Unwired Core Features (The "Fix-it" List)

#### [MODIFY] [convex/functions/users/index.ts](file:///home/nochaserz/Documents/Coding%20Projects/alora/convex/functions/users/index.ts)

- Ensure all mutations (create/update) are scoped to the `clerkOrganizationId`.

#### [MODIFY] [components/providers/SecurityProvider.tsx](file:///home/nochaserz/Documents/Coding%20Projects/alora/components/providers/SecurityProvider.tsx)

- Correct the sign-out path to properly clear the session via Clerk.

#### [MODIFY] [app/(auth)/onboarding.tsx](<file:///home/nochaserz/Documents/Coding%20Projects/alora/app/(auth)/onboarding.tsx>)

- Ensure the flow creates an organization and the first baby record sequentially.

#### [MODIFY] [app/(tabs)/calendar.tsx](<file:///home/nochaserz/Documents/Coding%20Projects/alora/app/(tabs)/calendar.tsx>)

- Verify hooks for appointments and medications are correctly passing data to `CalendarView`.

---

### 2. Strategic Enhancements (The "Reach" List)

#### [NEW] [convex/functions/insights.ts](file:///home/nochaserz/Documents/Coding%20Projects/alora/convex/functions/insights.ts)

- Implement an AI-powered insight engine that analyzes baby tracking data (sleep, feeds) and parent mood to generate personalized advice.

#### [MODIFY] [app/(tabs)/wellness.tsx](<file:///home/nochaserz/Documents/Coding%20Projects/alora/app/(tabs)/wellness.tsx>)

- Replace static affirmations with the dynamic "AI Daily Insight".
- Add "Smart Resource" recommendations based on recently logged data.

#### [NEW] [hooks/useSleepPrediction.ts](file:///home/nochaserz/Documents/Coding%20Projects/alora/hooks/useSleepPrediction.ts)

- A hook that calculates the "Next Nap Window" based on Huckleberry-style wake window logic.

#### [MODIFY] [app/(tabs)/partner-support.tsx](<file:///home/nochaserz/Documents/Coding%20Projects/alora/app/(tabs)/partner-support.tsx>)

- Implement "Context-Aware Nudges" (e.g., if one parent has logged 3+ night feeds, nudge the other partner to take the morning shift).

## Verification Plan

### Automated Tests

- Run existing Vitest suite: `bun run test`
- Create new Convex tests for org scoping: `convex/functions/users.test.ts`
- Command: `bun run test __tests__/convex/users.test.ts`

### Manual Verification

- **Onboarding**: Create a new account, ensure an org and baby are created.
- **AI Insights**: Log a few feeds/sleep entries and verify the "Daily Insight" appears in the Wellness tab.
- **Partner Sync**: Log data on one device and verify the nudge appears on another (if testing with 2 accounts in the same org).

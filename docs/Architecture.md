# Alora Architecture Document

## 1. Executive Summary

Alora is built on a modern, scalable architecture leveraging **React Native Expo** for cross-platform mobile development, **Convex** for real-time backend services, and **Bun** for fast development tooling. This architecture prioritizes offline-first functionality, real-time synchronization, and robust security to support new parents during critical early months.

---

## 2. Technology Stack

### Frontend
- **Framework:** React Native 0.73+
- **Platform:** Expo SDK 50+
- **Language:** TypeScript 5.0+
- **Navigation:** React Navigation 6.x
- **State Management:**
  - React Query (TanStack Query) for server state
  - Zustand for client-side UI state
- **UI Components:**
  - React Native Paper or NativeBase (to be decided)
  - Custom component library (atomic design)
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Expo Notifications
- **Date/Time:** date-fns or dayjs
- **Charts:** Victory Native or Recharts (for analytics)

### Backend
- **Backend-as-a-Service:** Convex (convex.dev)
  - Real-time database (PostgreSQL-based)
  - Serverless functions (queries, mutations, actions)
  - Built-in authentication
  - Automatic real-time subscriptions
- **Authentication:** Convex Auth with email/password (expandable to OAuth)

### Development Tooling
- **Runtime:** Bun 1.0+ (fast JavaScript runtime)
- **Package Manager:** Bun (faster than npm)
- **Testing:** Jest/Vitest + React Native Testing Library + Detox (E2E)
- **Linting:** ESLint + TypeScript ESLint
- **Formatting:** Prettier
- **Code Quality:** Husky + lint-staged (pre-commit hooks)
- **CI/CD:** GitHub Actions (or Bitbucket Pipelines, GitLab CI)
- **Type Safety:** TypeScript strict mode

### Infrastructure
- **Deployment:** Expo Application Services (EAS)
  - EAS Build for iOS and Android
  - EAS Submit for app store submission
- **Backend:** Convex (managed service)
- **CDN:** Expo-managed for app bundles
- **Monitoring:** Sentry (error tracking), Convex Analytics (backend metrics)

---

## 3. System Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        Client Layer                            │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   iOS App    │  │ Android App  │  │  Web App     │        │
│  │  (Expo Go)   │  │  (Expo Go)   │  │  (Optional)  │        │
│  │ React Native │  │ React Native │  │              │        │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘        │
│         │                  │                                    │
│         └────────┬─────────┘                                    │
│                  │                                             │
│         ┌────────▼────────┐                                    │
│         │ State Management│                                    │
│         │  (Zustand +     │                                    │
│         │   React Query)  │                                    │
│         └────────┬────────┘                                    │
│                  │                                             │
│         ┌────────▼────────┐                                    │
│         │  Convex Client  │                                    │
│         │  (WebSocket +   │                                    │
│         │   HTTP/2)       │                                    │
│         └────────┬────────┘                                    │
└──────────────────┼────────────────────────────────────────────┘
                   │
                   │ HTTPS (TLS 1.3) + WebSocket
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                  Backend Layer (Convex)                       │
│                                                                │
│  ┌────────────────────────────────────────────────────┐       │
│  │              Query Functions (Read)               │       │
│  │  - getFeeds, getDiapers, getSleep, etc.           │       │
│  │  - Auth checks: ctx.auth.userId                   │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  ┌────────────────────────────────────────────────────┐       │
│  │           Mutation Functions (Write)             │       │
│  │  - createFeed, updateMoodCheckIn, etc.            │       │
│  │  - Auth + permission checks                      │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  ┌────────────────────────────────────────────────────┐       │
│  │           Action Functions (Complex Logic)         │       │
│  │  - inviteToFamily, calculateTrends, etc.           │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  ┌────────────────────────────────────────────────────┐       │
│  │              Auth Functions                       │       │
│  │  - login, register, logout, verifyEmail           │       │
│  └────────────────────────────────────────────────────┘       │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                    Data Layer                                 │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Documents  │  │   Indexes    │  │   Vector     │       │
│  │   (Convex)    │  │  (Optimized  │  │   Search     │       │
│  │              │  │   Queries)    │  │  (Optional)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  Tables: families, users, familyMembers, babies, feeds,    │
│  diapers, sleep, growth, milestones, moodCheckIns,          │
│  journalEntries, affirmations, selfCareReminders,           │
│  appointments, medications                                    │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

**Read Flow:**
```
User Action → React Component → useQuery (React Query) → Convex Query → Database → Convex → Client → UI Update
```

**Write Flow:**
```
User Action → React Component → useMutation (React Query) → Convex Mutation → Database → Real-time Push → All Clients
```

**Real-Time Sync Flow:**
```
User A logs feed → Convex Mutation → Database → Convex Push → User A's Device (optimistic) + User B's Device (subscription) → UI Update on both
```

**Offline Flow:**
```
User logs feed (offline) → Convex Client Queue → Optimistic UI Update → Connection Restored → Convex Mutation → Database → Sync Ack → Remove from Queue
```

---

## 4. Database Schema (Convex)

### Core Entities

#### Users Table
```typescript
interface Users {
  _id: Id<"users">;
  email: string; // unique
  name: string;
  avatarUrl?: string;
  createdAt: number; // timestamp
  lastActiveAt: number; // timestamp
  preferences: {
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm
      end: string; // HH:mm
    };
    theme: "light" | "dark" | "auto";
    notificationsEnabled: boolean;
  };
}
```

#### Families Table
```typescript
interface Families {
  _id: Id<"families">;
  name?: string; // optional, families can be unnamed
  createdAt: number;
  settings: {
    premiumPlan: "free" | "premium";
    premiumExpiry?: number;
  };
}
```

#### FamilyMembers Table (Junction)
```typescript
interface FamilyMembers {
  _id: Id<"familyMembers">;
  familyId: Id<"families">;
  userId: Id<"users">;
  role: "primary" | "secondary" | "grandparent" | "sitter" | "other";
  permissions: Permission[];
  invitedBy: Id<"users">;
  joinedAt: number;
  isActive: boolean;
}

type Permission = "read" | "write" | "delete" | "invite" | "manage";
```

#### Babies Table
```typescript
interface Babies {
  _id: Id<"babies">;
  familyId: Id<"families">;
  name: string;
  birthDate: number; // timestamp
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  createdAt: number;
}
```

#### Feeds Table
```typescript
interface Feeds {
  _id: Id<"feeds">;
  babyId: Id<"babies">;
  userId: Id<"users">; // who logged it
  type: "breast" | "bottle" | "pumping";
  startTime: number; // timestamp
  endTime?: number; // timestamp (null if not ended yet)
  breast?: {
    side: "left" | "right" | "both";
    duration?: number; // seconds
  };
  bottle?: {
    amount: number;
    unit: "oz" | "mL";
  };
  pumping?: {
    amount?: number;
    unit: "oz" | "mL";
    duration?: number; // seconds
  };
  notes?: string;
  createdAt: number;
}
```

#### Diapers Table
```typescript
interface Diapers {
  _id: Id<"diapers">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  type: "wet" | "dirty" | "mixed";
  timestamp: number;
  notes?: string;
  createdAt: number;
}
```

#### Sleep Table
```typescript
interface Sleep {
  _id: Id<"sleep">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  startTime: number;
  endTime?: number; // null if not ended yet
  type: "nap" | "night";
  notes?: string;
  createdAt: number;
}
```

#### Growth Table
```typescript
interface Growth {
  _id: Id<"growth">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  date: number; // timestamp
  weight?: {
    value: number;
    unit: "lbs" | "kg";
  };
  height?: {
    value: number;
    unit: "in" | "cm";
  };
  headCircumference?: {
    value: number;
    unit: "in" | "cm";
  };
  notes?: string;
  createdAt: number;
}
```

#### Milestones Table
```typescript
interface Milestones {
  _id: Id<"milestones">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  title: string;
  date: number;
  notes?: string;
  photoUrl?: string;
  isShared: boolean; // visible to partner
  createdAt: number;
}
```

#### MoodCheckIns Table
```typescript
interface MoodCheckIns {
  _id: Id<"moodCheckIns">;
  userId: Id<"users">;
  familyId?: Id<"families">; // optional, for shared trends
  date: number;
  moodScore: number; // 1-10
  energyScore: number; // 1-10
  tags: string[];
  reflection?: string; // max 280 chars
  isPrivate: boolean; // visible to partner if false
  createdAt: number;
}
```

#### JournalEntries Table
```typescript
interface JournalEntries {
  _id: Id<"journalEntries">;
  userId: Id<"users">;
  title?: string;
  content: string;
  tags: string[];
  isPrivate: boolean; // visible to partner if false
  createdAt: number;
  updatedAt: number;
}
```

#### Affirmations Table
```typescript
interface Affirmations {
  _id: Id<"affirmations">;
  content: string;
  category: "self-compassion" | "normalization" | "celebration";
  isActive: boolean;
  displayCount: number; // analytics
  createdAt: number;
}
```

#### SelfCareReminders Table
```typescript
interface SelfCareReminders {
  _id: Id<"selfCareReminders">;
  userId: Id<"users">;
  type: "hydration" | "rest" | "nutrition" | "movement";
  lastTriggered?: number;
  frequencyHours: number;
  quietStart?: string; // HH:mm
  quietEnd?: string; // HH:mm
  isEnabled: boolean;
  createdAt: number;
}
```

#### Appointments Table
```typescript
interface Appointments {
  _id: Id<"appointments">;
  familyId: Id<"families">;
  babyId?: Id<"babies">;
  title: string;
  date: number;
  time?: number; // timestamp
  location?: string;
  notes?: string;
  type: "pediatrician" | "follow-up" | "health-task" | "other";
  completed: boolean;
  createdBy: Id<"users">;
  createdAt: number;
}
```

#### Medications Table
```typescript
interface Medications {
  _id: Id<"medications">;
  babyId?: Id<"babies">;
  userId?: Id<"users">;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate: number;
  endDate?: number;
  notes?: string;
  nextDueDate?: number;
  type: "vaccine" | "medication";
  createdBy: Id<"users">;
  createdAt: number;
}
```

### Indexes

Convex automatically creates indexes for all query fields. Additional custom indexes for optimization:

```typescript
// Convex schema configuration
export default defineSchema({
  feeds: defineTable({
    babyId: v.id("babies"),
    userId: v.id("users"),
    type: v.union(
      v.literal("breast"),
      v.literal("bottle"),
      v.literal("pumping")
    ),
    // ... other fields
  })
    .index("by_baby", ["babyId"])
    .index("by_baby_and_date", ["babyId", "startTime"])
    .index("by_user", ["userId"]),
    
  moodCheckIns: defineTable({
    userId: v.id("users"),
    date: v.number(),
    // ... other fields
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),
  
  // ... other tables
});
```

---

## 5. Frontend Architecture

### Directory Structure

```
alora/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── dashboard.tsx
│   │   ├── trackers.tsx
│   │   ├── wellness.tsx
│   │   ├── calendar.tsx
│   │   └── profile.tsx
│   ├── trackers/
│   │   ├── feed.tsx
│   │   ├── diaper.tsx
│   │   ├── sleep.tsx
│   │   ├── growth.tsx
│   │   └── milestone.tsx
│   ├── wellness/
│   │   ├── mood-checkin.tsx
│   │   ├── journal.tsx
│   │   └── affirmations.tsx
│   ├── _layout.tsx               # Root layout (auth check)
│   └── index.tsx
├── components/
│   ├── atoms/                    # Primitive components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Slider.tsx
│   │   ├── Avatar.tsx
│   │   └── ...
│   ├── molecules/                # Combined atoms
│   │   ├── FeedCard.tsx
│   │   ├── DiaperCard.tsx
│   │   ├── MoodSlider.tsx
│   │   ├── ...
│   ├── organisms/                # Complex components
│   │   ├── FeedTracker.tsx
│   │   ├── MoodCheckIn.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── ...
│   └── layout/
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── ...
├── features/                     # Feature-specific logic
│   ├── feeds/
│   │   ├── hooks/
│   │   │   ├── useFeeds.ts
│   │   │   ├── useCreateFeed.ts
│   │   │   └── ...
│   │   ├── components/
│   │   └── utils/
│   ├── diapers/
│   ├── sleep/
│   ├── wellness/
│   └── families/
├── hooks/
│   ├── useAuth.ts
│   ├── useOffline.ts
│   └── usePermissions.ts
├── stores/
│   ├── useAuthStore.ts
│   ├── useUIStore.ts
│   └── useNavigationStore.ts
├── lib/
│   ├── convex/
│   │   └── client.ts            # Convex client setup
│   ├── api/
│   │   └── convex.ts            # Generated API types
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── constants.ts
├── config/
│   ├── theme.ts                  # App theme
│   └── navigation.ts             # Navigation config
├── types/
│   ├── convex.ts                 # Convex types
│   └── app.ts                    # App-specific types
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── auth.config.ts            # Auth configuration
│   └── functions/                # Backend functions
│       ├── feeds/
│       ├── diapers/
│       ├── sleep/
│       ├── wellness/
│       ├── families/
│       └── auth/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── __tests__/
│   ├── components/
│   ├── features/
│   └── e2e/
├── docs/
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── README.md
```

### Component Architecture (Atomic Design)

**Atoms (Primitive UI elements)**
- Button, Input, Text, Icon, Avatar, Badge, Chip, Divider, etc.

**Molecules (Combined atoms)**
- FeedCard, DiaperCard, SleepCard, MoodSlider, TagSelector, etc.

**Organisms (Complex components)**
- FeedTracker, DiaperTracker, MoodCheckIn, ActivityFeed, CalendarView, etc.

**Templates (Page layouts)**
- DashboardLayout, TrackerLayout, WellnessLayout, etc.

**Pages (Full routes)**
- Dashboard, FeedTrackerPage, MoodCheckInPage, etc.

### State Management

**Server State (React Query)**
```typescript
// Example: useFeeds hook
export const useFeeds = (babyId: string, dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["feeds", babyId, dateRange],
    queryFn: () => convex.query(api.feeds.list, { babyId, ...dateRange }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Example: useCreateFeed hook
export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeedInput) =>
      convex.mutation(api.feeds.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};
```

**Client State (Zustand)**
```typescript
// Example: useUIStore
interface UIState {
  selectedBaby: string | null;
  theme: "light" | "dark" | "auto";
  setSelectedBaby: (id: string | null) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedBaby: null,
  theme: "auto",
  setSelectedBaby: (id) => set({ selectedBaby: id }),
  setTheme: (theme) => set({ theme }),
}));
```

### Navigation Structure

**Tab Navigation**
```
MainTabs
├── Dashboard (Stack)
├── Trackers (Stack)
│   ├── Feed
│   ├── Diaper
│   ├── Sleep
│   ├── Growth
│   └── Milestone
├── Wellness (Stack)
│   ├── Mood Check-In
│   ├── Journal
│   └── Affirmations
├── Calendar (Stack)
└── Profile (Stack)
```

**Modal Navigation**
```
Modals
├── QuickLog
├── FamilySettings
└── Notifications
```

---

## 6. Backend Architecture (Convex)

### Function Types

**Queries (Read)**
- No side effects
- Read-only database access
- Used for fetching data
- Automatically subscribed to for real-time updates

**Mutations (Write)**
- Modify database
- Run sequentially (no parallel execution)
- Trigger real-time updates to subscribers
- Must include auth and permission checks

**Actions (Complex Logic)**
- Long-running operations
- External API calls
- Complex business logic
- Cannot be subscribed to

**Auth Functions**
- Authentication-related
- Login, register, logout, verify email

### Example Functions

**Query: getFeeds**
```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFeeds = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Auth check
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Not authenticated");

    // Permission check
    const feed = await ctx.db.get(args.babyId);
    if (!feed) throw new Error("Baby not found");
    const familyMember = await ctx.db
      .query("familyMembers")
      .withIndex("by_user_and_family", (q) =>
        q.eq("userId", userId).eq("familyId", feed.familyId)
      )
      .first();
    if (!familyMember) throw new Error("Not authorized");

    // Fetch feeds
    let feedsQuery = ctx.db
      .query("feeds")
      .withIndex("by_baby", (q) => q.eq("babyId", args.babyId));

    if (args.startDate || args.endDate) {
      feedsQuery = feedsQuery.filter((q) => {
        if (args.startDate && q.startTime < args.startDate) return false;
        if (args.endDate && q.startTime > args.endDate) return false;
        return true;
      });
    }

    return await feedsQuery.order("desc").take(50);
  },
});
```

**Mutation: createFeed**
```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createFeed = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(
      v.literal("breast"),
      v.literal("bottle"),
      v.literal("pumping")
    ),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    amount: v.optional(v.number()),
    unit: v.optional(v.union(v.literal("oz"), v.literal("mL"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Auth check
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Not authenticated");

    // Permission check (write permission)
    const baby = await ctx.db.get(args.babyId);
    if (!baby) throw new Error("Baby not found");
    const familyMember = await ctx.db
      .query("familyMembers")
      .withIndex("by_user_and_family", (q) =>
        q.eq("userId", userId).eq("familyId", baby.familyId)
      )
      .first();
    if (!familyMember || !familyMember.permissions.includes("write")) {
      throw new Error("Not authorized");
    }

    // Create feed
    const feedId = await ctx.db.insert("feeds", {
      babyId: args.babyId,
      userId: userId.subject,
      type: args.type,
      startTime: args.startTime,
      endTime: args.endTime,
      // ... other fields based on type
      createdAt: Date.now(),
    });

    return feedId;
  },
});
```

**Action: inviteToFamily**
```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const inviteToFamily = action({
  args: {
    familyId: v.id("families"),
    email: v.string(),
    role: v.union(
      v.literal("primary"),
      v.literal("secondary"),
      v.literal("grandparent"),
      v.literal("sitter")
    ),
  },
  handler: async (ctx, args) => {
    // Auth check
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Not authenticated");

    // Permission check (invite permission)
    const familyMember = await ctx.runQuery(api.families.getFamilyMember, {
      familyId: args.familyId,
      userId: userId.subject,
    });
    if (!familyMember || !familyMember.permissions.includes("invite")) {
      throw new Error("Not authorized");
    }

    // Send invitation email (external API)
    const inviteLink = await generateInviteLink(args.familyId, args.role);
    await sendEmail(args.email, "You're invited to join Alora!", {
      body: `Click here to join: ${inviteLink}`,
    });

    // Store invite in database
    await ctx.runMutation(api.families.createInvite, {
      familyId: args.familyId,
      email: args.email,
      role: args.role,
      invitedBy: userId.subject,
    });

    return { success: true };
  },
});
```

---

## 7. Real-Time Synchronization

### Convex Real-Time Subscriptions

**Automatic Subscriptions**
```typescript
// This query automatically subscribes to changes
const feeds = useQuery(api.feeds.getFeeds, { babyId });
// Any change to feeds for this baby triggers a re-render
```

**Subscription Optimization**
```typescript
// Subscribe only to necessary data
const recentFeeds = useQuery(
  api.feeds.getFeeds,
  { babyId, startDate: Date.now() - 7 * 24 * 60 * 60 * 1000 } // Last 7 days
);
```

### Offline-First Strategy

**Optimistic UI Updates**
```typescript
export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeedInput) =>
      convex.mutation(api.feeds.create, data),
    onMutate: async (newFeed) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["feeds"] });

      // Snapshot previous value
      const previousFeeds = queryClient.getQueryData(["feeds"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["feeds"], (old) => [
        { ...newFeed, _id: "temp-id", createdAt: Date.now() },
        ...old,
      ]);

      return { previousFeeds };
    },
    onError: (err, newFeed, context) => {
      // Rollback on error
      queryClient.setQueryData(["feeds"], context.previousFeeds);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};
```

**Sync Status Indicator**
```typescript
export const SyncStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    // Monitor Convex sync status
    const syncUnsubscribe = convex.onSyncStatus((status) => {
      setPendingChanges(status.pendingOperations);
    });

    return () => {
      unsubscribe();
      syncUnsubscribe();
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isOnline && pendingChanges === 0 ? "green" : "yellow" },
        ]}
      />
      {pendingChanges > 0 && (
        <Text style={styles.statusText}>Syncing... ({pendingChanges})</Text>
      )}
      {!isOnline && <Text style={styles.statusText}>Offline</Text>}
    </View>
  );
};
```

### Conflict Resolution

**Timestamp-Based (Automatic)**
- Last-write-wins for most data
- Convex's CRDT-like approach handles merging
- No manual conflict resolution needed for MVP

**Future Enhancement: Manual Resolution**
- Detect overlapping edits
- Show conflict to user
- Allow user to choose which version to keep

---

## 8. Security & Privacy Architecture

### Authentication

**Convex Auth**
```typescript
// convex/auth.config.ts
export default convexAuth({
  providers: [
    PasswordProvider(),
    // Future: GoogleProvider(), AppleProvider()
  ],
});
```

**Session Management**
- Secure token storage (Expo SecureStore)
- Token refresh mechanism
- Auto-logout on token expiration

### Authorization (RBAC)

**Permission Check Middleware**
```typescript
export const requirePermission = (
  requiredPermissions: Permission[]
) => {
  return async (
    ctx: QueryCtx | MutationCtx,
    familyId: Id<"families">
  ) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Not authenticated");

    const familyMember = await ctx.db
      .query("familyMembers")
      .withIndex("by_user_and_family", (q) =>
        q.eq("userId", userId.subject).eq("familyId", familyId)
      )
      .first();

    if (!familyMember) throw new Error("Not authorized");

    const hasPermission = requiredPermissions.every((perm) =>
      familyMember.permissions.includes(perm)
    );

    if (!hasPermission) {
      throw new Error(`Missing required permissions: ${requiredPermissions.join(", ")}`);
    }

    return familyMember;
  };
};
```

**Usage in Functions**
```typescript
export const createFeed = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const baby = await ctx.db.get(args.babyId);
    await requirePermission(["write"])(ctx, baby.familyId);

    // ... rest of mutation
  },
});
```

### Data Encryption

**In Transit**
- TLS 1.3 (handled by Convex)

**At Rest**
- AES-256 (handled by Convex)

**Application-Level (Optional)**
- Sensitive fields can be encrypted before storage
- Journal entries, mood reflections
- Decryption key: user's password

### Data Minimization

**Collect Only What's Needed**
- No unnecessary PII
- Anonymized analytics
- Opt-in for usage data

**Data Retention**
- Default: 2 years
- User-configurable
- Soft delete with background cleanup

### Audit Trail

**Track All Changes**
```typescript
export const logActivity = async (
  ctx: MutationCtx,
  activity: {
    type: string;
    userId: Id<"users">;
    familyId: Id<"families">;
    details: any;
  }
) => {
  await ctx.db.insert("auditLog", {
    ...activity,
    timestamp: Date.now(),
  });
};

export const createFeed = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // ... create feed

    await logActivity(ctx, {
      type: "feed_created",
      userId: userId.subject,
      familyId: baby.familyId,
      details: { feedId, type: args.type },
    });
  },
});
```

---

## 9. Offline Support Architecture

### Convex Offline Capabilities

**Built-in Features**
- Automatic mutation queuing when offline
- Optimistic UI updates
- Background sync when connected
- Conflict resolution

### Implementation

**Offline Detection**
```typescript
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  return isOnline;
};
```

**Sync Queue Management**
```typescript
export const useSyncQueue = () => {
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    // Monitor Convex sync status
    const unsubscribe = convex.onSyncStatus((status) => {
      setQueueSize(status.pendingOperations);
    });

    return unsubscribe;
  }, []);

  return {
    queueSize,
    isSyncing: queueSize > 0,
  };
};
```

### Data Prefetching

**Prefetch Recent Data**
```typescript
export const prefetchRecentData = async (babyId: string) => {
  // Prefetch last 7 days of data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["feeds", babyId],
      queryFn: () => convex.query(api.feeds.getFeeds, {
        babyId,
        startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["diapers", babyId],
      queryFn: () => convex.query(api.diapers.getDiapers, {
        babyId,
        startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      }),
    }),
    // ... other data
  ]);
};
```

---

## 10. Performance Optimization

### Frontend Optimization

**Virtualized Lists**
```typescript
import { FlatList } from "react-native";

<FlatList
  data={feeds}
  renderItem={({ item }) => <FeedCard feed={item} />}
  keyExtractor={(item) => item._id}
  // Virtualization for performance
  windowSize={10}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
/>
```

**Memoization**
```typescript
import { memo } from "react";

const FeedCard = memo(({ feed }: { feed: Feed }) => {
  return <View>...</View>;
});
```

**Image Optimization**
```typescript
import { Image } from "expo-image";

<Image
  source={{ uri: feed.photoUrl }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  transition={200}
/>
```

### Backend Optimization

**Indexes**
- Index all query fields
- Composite indexes for complex queries

**Pagination**
- Limit result size (default: 50 items)
- Infinite scroll for large datasets

**Denormalization**
- Pre-calculate daily summaries
- Store aggregated data

```typescript
// Denormalized daily summary
export interface DailySummary {
  date: number;
  familyId: Id<"families">;
  babyId: Id<"babies">;
  feeds: {
    count: number;
    totalVolume: number;
  };
  diapers: {
    wet: number;
    dirty: number;
    mixed: number;
  };
  sleep: {
    totalMinutes: number;
    sessions: number;
  };
}
```

---

## 11. Monitoring & Observability

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  tracesSampleRate: 1.0,
});
```

### Analytics (Convex Analytics)

```typescript
// Track feature usage
export const trackEvent = (event: string, properties: any) => {
  convex.mutation(api.analytics.track, { event, properties });
};

// Example: Feed created
trackEvent("feed_created", {
  type: feed.type,
  hasNotes: !!feed.notes,
  timeOfDay: new Date().getHours(),
});
```

### Performance Monitoring

**API Latency**
```typescript
export const withPerformanceTracking = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  name: string
) => {
  return async (...args: T) => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - start;
      trackEvent("api_call", { name, duration });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      trackEvent("api_error", { name, duration, error });
      throw error;
    }
  };
};
```

---

## 12. Deployment & CI/CD

### Expo Application Services (EAS)

**Build Configuration**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": true
      }
    }
  }
}
```

**CI/CD Pipeline (GitHub Actions)**
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: bun install
      - run: bun run test
      - run: bun run typecheck
      - run: bun run lint

  build-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --profile preview
      - run: eas build --platform android --profile preview

  build-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --profile production
```

---

## 13. Scalability Considerations

### Current Capacity (MVP)
- 1,000 families
- 5,000 concurrent connections
- 10,000 operations/day
- 100GB storage

### Future Scaling
- **Convex Scaling:** Automatic (managed service)
- **Geographic Distribution:** Multiple regions (post-MVP)
- **CDN:** For static assets (Expo-managed)
- **Database:** Convex scales automatically

### Load Testing
```typescript
// Load testing script (pre-launch)
import { benchmark } from "convex-benchmark";

benchmark({
  concurrentUsers: 100,
  operationsPerUser: 1000,
  operations: [
    { name: "createFeed", fn: () => convex.mutation(api.feeds.create, {}) },
    { name: "getFeeds", fn: () => convex.query(api.feeds.getFeeds, {}) },
  ],
});
```

---

## 14. Disaster Recovery

### Backup Strategy
- **Convex:** Automatic backups (managed)
- **Export:** User data export feature (GDPR)
- **Recovery:** Restore from Convex backup

### Incident Response
1. Monitor errors via Sentry
2. Alert team for critical errors
3. Rollback if needed
4. Communicate with users
5. Post-mortem and improvements

---

## 15. Development Workflow

### Branching Strategy
```
main (production)
  └── develop (staging)
       ├── feature/tracker-feeds
       ├── feature/tracker-diapers
       ├── feature/wellness-mood
       └── feature/family-sync
```

### Git Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Create pull request to `develop`
4. Code review and feedback
5. Merge to `develop`
6. Deploy to preview environment
7. Test preview build
8. Merge `develop` to `main`
9. Deploy to production

---

## 16. Open Questions & Future Work

### Open Questions
1. Should we use React Native Paper or NativeBase for UI components?
2. What charting library for analytics? Victory Native or Recharts?
3. Should we implement application-level encryption for sensitive data?

### Future Architecture Enhancements
- **Push Notifications:** Integration with FCM/APNs
- **Deep Linking:** Navigate to specific screens from links
- **Background Sync:** Sync when app is in background
- **Biometric Auth:** Face ID/Touch ID for quick access
- **Analytics Dashboard:** Internal dashboard for monitoring

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Next Review:** During architecture review phase (Week 2)

# Alora Technical Specification

## 1. Overview

This document provides detailed technical specifications for the Alora application, including component-level specs, data models, API contracts, and implementation details. It serves as the technical blueprint for the development team.

---

## 2. Technical Stack

- **Frontend:** React Native 0.73+, Expo SDK 50+, TypeScript 5.0+
- **Backend:** Convex (queries, mutations, actions)
- **State:** React Query (TanStack Query), Zustand
- **Navigation:** React Navigation 6.x
- **Forms:** React Hook Form + Zod
- **Testing:** Jest/Vitest + React Native Testing Library + Detox
- **Runtime:** Bun 1.0+

---

## 3. Data Models

### 3.1 User Model

```typescript
interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
  lastActiveAt: number;
  preferences: UserPreferences;
}

interface UserPreferences {
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  theme: "light" | "dark" | "auto";
  notificationsEnabled: boolean;
  selfCareReminderFrequency: number; // hours
}
```

### 3.2 Family Model

```typescript
interface Family {
  _id: Id<"families">;
  name?: string;
  createdAt: number;
  settings: FamilySettings;
}

interface FamilySettings {
  premiumPlan: "free" | "premium";
  premiumExpiry?: number;
  dataRetentionYears: number; // default: 2
}
```

### 3.3 FamilyMember Model

```typescript
interface FamilyMember {
  _id: Id<"familyMembers">;
  familyId: Id<"families">;
  userId: Id<"users">;
  role: FamilyRole;
  permissions: Permission[];
  invitedBy: Id<"users">;
  joinedAt: number;
  isActive: boolean;
}

type FamilyRole = "primary" | "secondary" | "grandparent" | "sitter" | "other";

type Permission = "read" | "write" | "delete" | "invite" | "manage";
```

### 3.4 Baby Model

```typescript
interface Baby {
  _id: Id<"babies">;
  familyId: Id<"families">;
  name: string;
  birthDate: number;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  createdAt: number;
}
```

### 3.5 Feed Model

```typescript
interface Feed {
  _id: Id<"feeds">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  type: "breast" | "bottle" | "pumping";
  startTime: number;
  endTime?: number;
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

### 3.6 Diaper Model

```typescript
interface Diaper {
  _id: Id<"diapers">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  type: "wet" | "dirty" | "mixed";
  timestamp: number;
  notes?: string;
  createdAt: number;
}
```

### 3.7 Sleep Model

```typescript
interface Sleep {
  _id: Id<"sleep">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  startTime: number;
  endTime?: number;
  type: "nap" | "night";
  notes?: string;
  createdAt: number;
}
```

### 3.8 Growth Model

```typescript
interface Growth {
  _id: Id<"growth">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  date: number;
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

### 3.9 Milestone Model

```typescript
interface Milestone {
  _id: Id<"milestones">;
  babyId: Id<"babies">;
  userId: Id<"users">;
  title: string;
  date: number;
  notes?: string;
  photoUrl?: string;
  isShared: boolean;
  createdAt: number;
}
```

### 3.10 MoodCheckIn Model

```typescript
interface MoodCheckIn {
  _id: Id<"moodCheckIns">;
  userId: Id<"users">;
  familyId?: Id<"families">;
  date: number;
  moodScore: number; // 1-10
  energyScore: number; // 1-10
  tags: string[];
  reflection?: string; // max 280 chars
  isPrivate: boolean;
  createdAt: number;
}
```

### 3.11 JournalEntry Model

```typescript
interface JournalEntry {
  _id: Id<"journalEntries">;
  userId: Id<"users">;
  title?: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### 3.12 Affirmation Model

```typescript
interface Affirmation {
  _id: Id<"affirmations">;
  content: string;
  category: "self-compassion" | "normalization" | "celebration";
  isActive: boolean;
  displayCount: number;
  createdAt: number;
}
```

### 3.13 SelfCareReminder Model

```typescript
interface SelfCareReminder {
  _id: Id<"selfCareReminders">;
  userId: Id<"users">;
  type: "hydration" | "rest" | "nutrition" | "movement";
  lastTriggered?: number;
  frequencyHours: number;
  quietStart?: string; // "HH:mm"
  quietEnd?: string; // "HH:mm"
  isEnabled: boolean;
  createdAt: number;
}
```

### 3.14 Appointment Model

```typescript
interface Appointment {
  _id: Id<"appointments">;
  familyId: Id<"families">;
  babyId?: Id<"babies">;
  title: string;
  date: number;
  time?: number;
  location?: string;
  notes?: string;
  type: "pediatrician" | "follow-up" | "health-task" | "other";
  completed: boolean;
  createdBy: Id<"users">;
  createdAt: number;
}
```

### 3.15 Medication Model

```typescript
interface Medication {
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

---

## 4. Component Specifications

### 4.1 Atoms (Primitive Components)

#### Button
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

// Usage
<Button onPress={handlePress} variant="primary" size="md">
  Save Feed
</Button>
```

**Specifications:**
- Variants: primary (filled blue), secondary (gray filled), outline (bordered), ghost (transparent with hover)
- Sizes: sm (height: 36px), md (height: 44px), lg (height: 52px)
- Loading state shows spinner overlay
- Disabled state reduces opacity and removes press feedback

---

#### Input
```typescript
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  maxLength?: number;
}

// Usage
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
  error={error}
/>
```

**Specifications:**
- Floating label animation
- Error message displays below input
- Character counter if maxLength specified
- Focus outline color matches theme

---

#### Slider
```typescript
interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  emojiLabels?: Record<number, string>;
}

// Usage
<Slider
  label="How are you feeling?"
  value={mood}
  onValueChange={setMood}
  min={1}
  max={10}
  step={1}
  showValue
  emojiLabels={{ 1: "😢", 5: "😐", 10: "😊" }}
/>
```

**Specifications:**
- Smooth thumb drag
- Value display updates in real-time
- Emoji labels show at specific values
- Haptic feedback on value change

---

#### Tag
```typescript
interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

// Usage
<Tag selected onPress={() => toggleTag("grateful")}>
  Grateful
</Tag>
```

**Specifications:**
- Selected state: solid color with white text
- Unselected state: outlined with colored text
- Remove button (X) shows on hover or press
- Compact size for tag selectors

---

### 4.2 Molecules (Combined Components)

#### FeedCard
```typescript
interface FeedCardProps {
  feed: Feed;
  onPress?: () => void;
}

// Usage
<FeedCard feed={feed} onPress={handleEdit} />
```

**Specifications:**
- Shows feed type icon (breast, bottle, pumping)
- Displays time (e.g., "2:30 PM")
- Shows details based on type:
  - Breast: side + duration (e.g., "Left breast, 15 min")
  - Bottle: amount + unit (e.g., "6 oz")
  - Pumping: amount + duration (e.g., "4 oz, 20 min")
- Shows user avatar (who logged it)
- Optional notes truncated with "..." if long
- Press feedback (opacity change)
- Right arrow for edit/view details

---

#### DiaperCard
```typescript
interface DiaperCardProps {
  diaper: Diaper;
  onPress?: () => void;
}

// Usage
<DiaperCard diaper={diaper} />
```

**Specifications:**
- Shows diaper type icon (wet, dirty, mixed)
- Color-coded: wet (blue), dirty (brown), mixed (purple)
- Displays time (e.g., "2:30 PM")
- Shows user avatar
- Optional notes truncated
- Press feedback

---

#### SleepCard
```typescript
interface SleepCardProps {
  sleep: Sleep;
  onPress?: () => void;
}

// Usage
<SleepCard sleep={sleep} />
```

**Specifications:**
- Shows sleep type icon (nap = sun, night = moon)
- Displays duration (e.g., "2h 15min")
- Shows time range (e.g., "1:00 PM - 3:15 PM")
- Shows user avatar
- Optional notes truncated
- Press feedback

---

#### MoodSlider
```typescript
interface MoodSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
}

// Usage
<MoodSlider
  label="How are you feeling today?"
  value={moodScore}
  onValueChange={setMoodScore}
/>
```

**Specifications:**
- Slider from 1-10
- Emoji labels at each value: 😢 😟 😐 🙂 😊
- Current value displayed above slider
- Haptic feedback on value change
- Smooth animations

---

#### TagSelector
```typescript
interface TagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  maxSelection?: number;
}

// Usage
<TagSelector
  tags={["Grateful", "Hard Day", "Funny Moment", "Tired"]}
  selectedTags={selectedTags}
  onToggle={handleToggleTag}
  maxSelection={3}
/>
```

**Specifications:**
- Tags display as chips
- Selected tags: filled with accent color
- Unselected tags: outlined
- Max selection disables unselected tags
- Haptic feedback on selection

---

### 4.3 Organisms (Complex Components)

#### FeedTracker
```typescript
interface FeedTrackerProps {
  babyId: string;
}

// Usage
<FeedTracker babyId={babyId} />
```

**Specifications:**
- Quick-action buttons: "Start Breastfeed", "Log Bottle", "Start Pumping"
- Active timer display (if session in progress)
- Pause/resume button for timed sessions
- Form fields based on type:
  - Breast: side selector (left, right, both)
  - Bottle: amount input with presets (2oz, 4oz, 6oz, 8oz)
  - Pumping: amount input, duration
- Optional notes field (multiline)
- Save button
- Recent feeds list (last 5)
- Daily summary at top (total feeds, total volume)
- Confetti animation on completion

**State Management:**
```typescript
interface FeedTrackerState {
  type: "breast" | "bottle" | "pumping" | null;
  isTimerRunning: boolean;
  startTime: number | null;
  elapsed: number;
  side?: "left" | "right" | "both";
  amount?: number;
  unit?: "oz" | "mL";
  notes: string;
}
```

---

#### DiaperTracker
```typescript
interface DiaperTrackerProps {
  babyId: string;
}

// Usage
<DiaperTracker babyId={babyId} />
```

**Specifications:**
- Type selector: wet, dirty, mixed (icons)
- Time selector (defaults to current, editable)
- Optional notes field
- Save button
- Recent diapers list (last 5)
- Daily count: wet, dirty, mixed totals
- Color-coded chips

---

#### SleepTracker
```typescript
interface SleepTrackerProps {
  babyId: string;
}

// Usage
<SleepTracker babyId={babyId} />
```

**Specifications:**
- Start/stop button for timed sessions
- Manual entry mode (start/end time inputs)
- Type selector: nap, night
- Optional notes field
- Save button
- Recent sleep list (last 5)
- Daily total sleep time
- Visual timeline (day view with sleep blocks)

---

#### GrowthTracker
```typescript
interface GrowthTrackerProps {
  babyId: string;
}

// Usage
<GrowthTracker babyId={babyId} />
```

**Specifications:**
- Date picker (defaults to today)
- Weight input (number + unit selector: lbs/kg)
- Height input (number + unit selector: in/cm)
- Head circumference input (optional)
- Optional notes field
- Save button
- Growth history list
- Growth chart (line chart) with percentiles
- WHO growth standards

---

#### MilestoneTracker
```typescript
interface MilestoneTrackerProps {
  babyId: string;
}

// Usage
<MilestoneTracker babyId={babyId} />
```

**Specifications:**
- Title input
- Date picker
- Photo upload (optional)
- Optional notes field
- "Share with partner" toggle
- Save button
- Milestone timeline (chronological)
- Photo gallery view
- Share functionality

---

#### MoodCheckIn
```typescript
interface MoodCheckInProps {
  userId: string;
}

// Usage
<MoodCheckIn userId={userId} />
```

**Specifications:**
- Mood slider (1-10) with emojis
- Energy slider (1-10)
- Tag selector (multi-select): Grateful, Hard Day, Funny Moment, Tired, Anxious, Accomplished, Loved
- Optional reflection text input (max 280 chars, character counter)
- Privacy toggle: "Share with partner" / "Keep private"
- Submit button with animation
- Success message
- Mood history view (last 7 days mini-chart)

---

#### QuickJournal
```typescript
interface QuickJournalProps {
  userId: string;
}

// Usage
<QuickJournal userId={userId} />
```

**Specifications:**
- Title input (optional)
- Content input (multiline, no strict limit)
- Tag selector (multi-select)
- Privacy toggle: "Share with partner" / "Keep private"
- Save button
- Journal list (chronological)
- Search/filter by tags
- Edit and delete options
- Swipe to delete

---

#### ActivityFeed
```typescript
interface ActivityFeedProps {
  familyId: string;
}

// Usage
<ActivityFeed familyId={familyId} />
```

**Specifications:**
- Reverse chronological order
- Activity types: feeds, diapers, sleep, milestones, journal entries, mood check-ins
- Each activity shows:
  - Icon based on type
  - Time (e.g., "2:30 PM")
  - User avatar (who logged it)
  - Key details
- "Today" vs "Earlier" sections
- Infinite scroll (load more on bottom)
- Pull to refresh
- Filter by activity type (optional)

---

#### CalendarView
```typescript
interface CalendarViewProps {
  familyId: string;
  babyId?: string;
}

// Usage
<CalendarView familyId={familyId} />
```

**Specifications:**
- Month/Week/Day view toggle
- Calendar grid with appointments
- Appointment color-coded by type
- Tap on appointment to view details
- Add appointment button (FAB)
- Appointment details:
  - Title
  - Date/time
  - Location (optional)
  - Notes
  - Completed checkbox
- Reminder time (24 hours before)

---

### 4.4 Layout Components

#### Header
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

// Usage
<Header
  title="Dashboard"
  subtitle="Good morning, Emma!"
  rightAction={<SyncStatusIndicator />}
/>
```

**Specifications:**
- Fixed height (60px)
- Title text (bold)
- Optional subtitle (gray, smaller)
- Left/right action slots
- Back button automatically handled by navigation

---

#### TabBar
```typescript
interface TabBarProps {
  state: any; // Navigation state
  descriptors: any; // Navigation descriptors
}

// Usage
// Used by React Navigation Tab Navigator
```

**Specifications:**
- 5 tabs: Dashboard, Trackers, Wellness, Calendar, Profile
- Icons: active (filled), inactive (outline)
- Active tab indicator (accent color line)
- Haptic feedback on tab press
- Badge for notifications (optional)

---

## 5. API Contracts

### 5.1 Convex Query Functions

#### getBaby
```typescript
// Input
interface GetBabyInput {
  babyId: Id<"babies">;
}

// Output
interface GetBabyOutput {
  baby: Baby;
  permissions: Permission[];
}

// Convex signature
export const getBaby = query({
  args: {
    babyId: v.id("babies"),
  },
  handler: async (ctx, args): Promise<GetBabyOutput> => {
    // Implementation
  },
});
```

---

#### getBabiesByFamily
```typescript
// Input
interface GetBabiesByFamilyInput {
  familyId: Id<"families">;
}

// Output
interface GetBabiesByFamilyOutput {
  babies: Baby[];
}

// Convex signature
export const getBabiesByFamily = query({
  args: {
    familyId: v.id("families"),
  },
  handler: async (ctx, args): Promise<GetBabiesByFamilyOutput> => {
    // Implementation
  },
});
```

---

#### getFeeds
```typescript
// Input
interface GetFeedsInput {
  babyId: Id<"babies">;
  startDate?: number;
  endDate?: number;
  limit?: number;
}

// Output
interface GetFeedsOutput {
  feeds: Feed[];
}

// Convex signature
export const getFeeds = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetFeedsOutput> => {
    // Implementation
  },
});
```

---

#### getFeedsSummary
```typescript
// Input
interface GetFeedsSummaryInput {
  babyId: Id<"babies">;
  date: number; // timestamp (start of day)
}

// Output
interface GetFeedsSummaryOutput {
  totalFeeds: number;
  totalVolume: number;
  byType: {
    breast: number;
    bottle: number;
    pumping: number;
  };
}

// Convex signature
export const getFeedsSummary = query({
  args: {
    babyId: v.id("babies"),
    date: v.number(),
  },
  handler: async (ctx, args): Promise<GetFeedsSummaryOutput> => {
    // Implementation
  },
});
```

---

#### getDiapers
```typescript
// Input
interface GetDiapersInput {
  babyId: Id<"babies">;
  startDate?: number;
  endDate?: number;
  limit?: number;
}

// Output
interface GetDiapersOutput {
  diapers: Diaper[];
}

// Convex signature
export const getDiapers = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetDiapersOutput> => {
    // Implementation
  },
});
```

---

#### getDiapersSummary
```typescript
// Input
interface GetDiapersSummaryInput {
  babyId: Id<"babies">;
  date: number; // timestamp (start of day)
}

// Output
interface GetDiapersSummaryOutput {
  total: number;
  wet: number;
  dirty: number;
  mixed: number;
}

// Convex signature
export const getDiapersSummary = query({
  args: {
    babyId: v.id("babies"),
    date: v.number(),
  },
  handler: async (ctx, args): Promise<GetDiapersSummaryOutput> => {
    // Implementation
  },
});
```

---

#### getSleep
```typescript
// Input
interface GetSleepInput {
  babyId: Id<"babies">;
  startDate?: number;
  endDate?: number;
  limit?: number;
}

// Output
interface GetSleepOutput {
  sleep: Sleep[];
}

// Convex signature
export const getSleep = query({
  args: {
    babyId: v.id("babies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetSleepOutput> => {
    // Implementation
  },
});
```

---

#### getGrowth
```typescript
// Input
interface GetGrowthInput {
  babyId: Id<"babies">;
  limit?: number;
}

// Output
interface GetGrowthOutput {
  growth: Growth[];
}

// Convex signature
export const getGrowth = query({
  args: {
    babyId: v.id("babies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetGrowthOutput> => {
    // Implementation
  },
});
```

---

#### getMilestones
```typescript
// Input
interface GetMilestonesInput {
  babyId: Id<"babies">;
  limit?: number;
}

// Output
interface GetMilestonesOutput {
  milestones: Milestone[];
}

// Convex signature
export const getMilestones = query({
  args: {
    babyId: v.id("babies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetMilestonesOutput> => {
    // Implementation
  },
});
```

---

#### getMoodCheckIns
```typescript
// Input
interface GetMoodCheckInsInput {
  userId: Id<"users">;
  startDate?: number;
  endDate?: number;
  limit?: number;
}

// Output
interface GetMoodCheckInsOutput {
  checkIns: MoodCheckIn[];
}

// Convex signature
export const getMoodCheckIns = query({
  args: {
    userId: v.id("users"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetMoodCheckInsOutput> => {
    // Implementation
  },
});
```

---

#### getMoodTrends
```typescript
// Input
interface GetMoodTrendsInput {
  userId: Id<"users">;
  days: number; // last N days
}

// Output
interface GetMoodTrendsOutput {
  trends: {
    date: number;
    moodScore: number;
    energyScore: number;
  }[];
}

// Convex signature
export const getMoodTrends = query({
  args: {
    userId: v.id("users"),
    days: v.number(),
  },
  handler: async (ctx, args): Promise<GetMoodTrendsOutput> => {
    // Implementation
  },
});
```

---

#### getJournalEntries
```typescript
// Input
interface GetJournalEntriesInput {
  userId: Id<"users">;
  limit?: number;
}

// Output
interface GetJournalEntriesOutput {
  entries: JournalEntry[];
}

// Convex signature
export const getJournalEntries = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetJournalEntriesOutput> => {
    // Implementation
  },
});
```

---

#### getTodayAffirmation
```typescript
// Input (none)

// Output
interface GetTodayAffirmationOutput {
  affirmation: Affirmation | null;
}

// Convex signature
export const getTodayAffirmation = query({
  args: {},
  handler: async (ctx): Promise<GetTodayAffirmationOutput> => {
    // Implementation
  },
});
```

---

#### getAppointments
```typescript
// Input
interface GetAppointmentsInput {
  familyId: Id<"families">;
  startDate?: number;
  endDate?: number;
}

// Output
interface GetAppointmentsOutput {
  appointments: Appointment[];
}

// Convex signature
export const getAppointments = query({
  args: {
    familyId: v.id("families"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<GetAppointmentsOutput> => {
    // Implementation
  },
});
```

---

### 5.2 Convex Mutation Functions

#### createFeed
```typescript
// Input
interface CreateFeedInput {
  babyId: Id<"babies">;
  type: "breast" | "bottle" | "pumping";
  startTime: number;
  endTime?: number;
  breast?: {
    side: "left" | "right" | "both";
    duration?: number;
  };
  bottle?: {
    amount: number;
    unit: "oz" | "mL";
  };
  pumping?: {
    amount?: number;
    unit: "oz" | "mL";
    duration?: number;
  };
  notes?: string;
}

// Output
interface CreateFeedOutput {
  feedId: Id<"feeds">;
}

// Convex signature
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
    breast: v.optional(
      v.object({
        side: v.union(
          v.literal("left"),
          v.literal("right"),
          v.literal("both")
        ),
        duration: v.optional(v.number()),
      })
    ),
    bottle: v.optional(
      v.object({
        amount: v.number(),
        unit: v.union(v.literal("oz"), v.literal("mL")),
      })
    ),
    pumping: v.optional(
      v.object({
        amount: v.optional(v.number()),
        unit: v.union(v.literal("oz"), v.literal("mL")),
        duration: v.optional(v.number()),
      })
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CreateFeedOutput> => {
    // Implementation
  },
});
```

---

#### updateFeed
```typescript
// Input
interface UpdateFeedInput {
  feedId: Id<"feeds">;
  updates: Partial<Omit<Feed, "_id" | "babyId" | "userId" | "createdAt">>;
}

// Output
interface UpdateFeedOutput {
  success: boolean;
}

// Convex signature
export const updateFeed = mutation({
  args: {
    feedId: v.id("feeds"),
    updates: v.any(),
  },
  handler: async (ctx, args): Promise<UpdateFeedOutput> => {
    // Implementation
  },
});
```

---

#### deleteFeed
```typescript
// Input
interface DeleteFeedInput {
  feedId: Id<"feeds">;
}

// Output
interface DeleteFeedOutput {
  success: boolean;
}

// Convex signature
export const deleteFeed = mutation({
  args: {
    feedId: v.id("feeds"),
  },
  handler: async (ctx, args): Promise<DeleteFeedOutput> => {
    // Implementation
  },
});
```

---

#### createDiaper
```typescript
// Input
interface CreateDiaperInput {
  babyId: Id<"babies">;
  type: "wet" | "dirty" | "mixed";
  timestamp: number;
  notes?: string;
}

// Output
interface CreateDiaperOutput {
  diaperId: Id<"diapers">;
}

// Convex signature
export const createDiaper = mutation({
  args: {
    babyId: v.id("babies"),
    type: v.union(v.literal("wet"), v.literal("dirty"), v.literal("mixed")),
    timestamp: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CreateDiaperOutput> => {
    // Implementation
  },
});
```

---

#### createSleep
```typescript
// Input
interface CreateSleepInput {
  babyId: Id<"babies">;
  startTime: number;
  endTime?: number;
  type: "nap" | "night";
  notes?: string;
}

// Output
interface CreateSleepOutput {
  sleepId: Id<"sleep">;
}

// Convex signature
export const createSleep = mutation({
  args: {
    babyId: v.id("babies"),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    type: v.union(v.literal("nap"), v.literal("night")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CreateSleepOutput> => {
    // Implementation
  },
});
```

---

#### createGrowth
```typescript
// Input
interface CreateGrowthInput {
  babyId: Id<"babies">;
  date: number;
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
}

// Output
interface CreateGrowthOutput {
  growthId: Id<"growth">;
}

// Convex signature
export const createGrowth = mutation({
  args: {
    babyId: v.id("babies"),
    date: v.number(),
    weight: v.optional(
      v.object({
        value: v.number(),
        unit: v.union(v.literal("lbs"), v.literal("kg")),
      })
    ),
    height: v.optional(
      v.object({
        value: v.number(),
        unit: v.union(v.literal("in"), v.literal("cm")),
      })
    ),
    headCircumference: v.optional(
      v.object({
        value: v.number(),
        unit: v.union(v.literal("in"), v.literal("cm")),
      })
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CreateGrowthOutput> => {
    // Implementation
  },
});
```

---

#### createMilestone
```typescript
// Input
interface CreateMilestoneInput {
  babyId: Id<"babies">;
  title: string;
  date: number;
  notes?: string;
  photoUrl?: string;
  isShared: boolean;
}

// Output
interface CreateMilestoneOutput {
  milestoneId: Id<"milestones">;
}

// Convex signature
export const createMilestone = mutation({
  args: {
    babyId: v.id("babies"),
    title: v.string(),
    date: v.number(),
    notes: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    isShared: v.boolean(),
  },
  handler: async (ctx, args): Promise<CreateMilestoneOutput> => {
    // Implementation
  },
});
```

---

#### createMoodCheckIn
```typescript
// Input
interface CreateMoodCheckInInput {
  userId: Id<"users">;
  familyId?: Id<"families">;
  date: number;
  moodScore: number;
  energyScore: number;
  tags: string[];
  reflection?: string;
  isPrivate: boolean;
}

// Output
interface CreateMoodCheckInOutput {
  checkInId: Id<"moodCheckIns">;
}

// Convex signature
export const createMoodCheckIn = mutation({
  args: {
    userId: v.id("users"),
    familyId: v.optional(v.id("families")),
    date: v.number(),
    moodScore: v.number(),
    energyScore: v.number(),
    tags: v.array(v.string()),
    reflection: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args): Promise<CreateMoodCheckInOutput> => {
    // Implementation
  },
});
```

---

#### createJournalEntry
```typescript
// Input
interface CreateJournalEntryInput {
  userId: Id<"users">;
  title?: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
}

// Output
interface CreateJournalEntryOutput {
  entryId: Id<"journalEntries">;
}

// Convex signature
export const createJournalEntry = mutation({
  args: {
    userId: v.id("users"),
    title: v.optional(v.string()),
    content: v.string(),
    tags: v.array(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args): Promise<CreateJournalEntryOutput> => {
    // Implementation
  },
});
```

---

#### updateJournalEntry
```typescript
// Input
interface UpdateJournalEntryInput {
  entryId: Id<"journalEntries">;
  updates: Partial<
    Pick<JournalEntry, "title" | "content" | "tags" | "isPrivate">
  >;
}

// Output
interface UpdateJournalEntryOutput {
  success: boolean;
}

// Convex signature
export const updateJournalEntry = mutation({
  args: {
    entryId: v.id("journalEntries"),
    updates: v.any(),
  },
  handler: async (ctx, args): Promise<UpdateJournalEntryOutput> => {
    // Implementation
  },
});
```

---

#### deleteJournalEntry
```typescript
// Input
interface DeleteJournalEntryInput {
  entryId: Id<"journalEntries">;
}

// Output
interface DeleteJournalEntryOutput {
  success: boolean;
}

// Convex signature
export const deleteJournalEntry = mutation({
  args: {
    entryId: v.id("journalEntries"),
  },
  handler: async (ctx, args): Promise<DeleteJournalEntryOutput> => {
    // Implementation
  },
});
```

---

#### createAppointment
```typescript
// Input
interface CreateAppointmentInput {
  familyId: Id<"families">;
  babyId?: Id<"babies">;
  title: string;
  date: number;
  time?: number;
  location?: string;
  notes?: string;
  type: "pediatrician" | "follow-up" | "health-task" | "other";
}

// Output
interface CreateAppointmentOutput {
  appointmentId: Id<"appointments">;
}

// Convex signature
export const createAppointment = mutation({
  args: {
    familyId: v.id("families"),
    babyId: v.optional(v.id("babies")),
    title: v.string(),
    date: v.number(),
    time: v.optional(v.number()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    type: v.union(
      v.literal("pediatrician"),
      v.literal("follow-up"),
      v.literal("health-task"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args): Promise<CreateAppointmentOutput> => {
    // Implementation
  },
});
```

---

#### completeAppointment
```typescript
// Input
interface CompleteAppointmentInput {
  appointmentId: Id<"appointments">;
}

// Output
interface CompleteAppointmentOutput {
  success: boolean;
}

// Convex signature
export const completeAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args): Promise<CompleteAppointmentOutput> => {
    // Implementation
  },
});
```

---

### 5.3 Convex Action Functions

#### inviteToFamily
```typescript
// Input
interface InviteToFamilyInput {
  familyId: Id<"families">;
  email: string;
  role: "primary" | "secondary" | "grandparent" | "sitter" | "other";
}

// Output
interface InviteToFamilyOutput {
  success: boolean;
}

// Convex signature
export const inviteToFamily = action({
  args: {
    familyId: v.id("families"),
    email: v.string(),
    role: v.union(
      v.literal("primary"),
      v.literal("secondary"),
      v.literal("grandparent"),
      v.literal("sitter"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args): Promise<InviteToFamilyOutput> => {
    // Implementation (external API call)
  },
});
```

---

## 6. Validation Schemas

### 6.1 Feed Validation
```typescript
import { z } from "zod";

export const createFeedSchema = z.object({
  babyId: z.string(),
  type: z.enum(["breast", "bottle", "pumping"]),
  startTime: z.number(),
  endTime: z.number().optional(),
  breast: z.object({
    side: z.enum(["left", "right", "both"]),
    duration: z.number().optional(),
  }).optional(),
  bottle: z.object({
    amount: z.number().min(0.1).max(32), // Max 32 oz
    unit: z.enum(["oz", "mL"]),
  }).optional(),
  pumping: z.object({
    amount: z.number().min(0.1).max(32),
    unit: z.enum(["oz", "mL"]),
    duration: z.number().optional(),
  }).optional(),
  notes: z.string().max(280).optional(),
}).refine((data) => {
  // Validate based on type
  if (data.type === "breast" && !data.breast) return false;
  if (data.type === "bottle" && !data.bottle) return false;
  if (data.type === "pumping" && !data.pumping) return false;
  return true;
}, "Must provide data for the selected type");

export type CreateFeedInput = z.infer<typeof createFeedSchema>;
```

### 6.2 Diaper Validation
```typescript
export const createDiaperSchema = z.object({
  babyId: z.string(),
  type: z.enum(["wet", "dirty", "mixed"]),
  timestamp: z.number(),
  notes: z.string().max(280).optional(),
});

export type CreateDiaperInput = z.infer<typeof createDiaperSchema>;
```

### 6.3 Sleep Validation
```typescript
export const createSleepSchema = z.object({
  babyId: z.string(),
  startTime: z.number(),
  endTime: z.number().optional(),
  type: z.enum(["nap", "night"]),
  notes: z.string().max(280).optional(),
});

export type CreateSleepInput = z.infer<typeof createSleepSchema>;
```

### 6.4 Mood Check-In Validation
```typescript
export const createMoodCheckInSchema = z.object({
  userId: z.string(),
  familyId: z.string().optional(),
  date: z.number(),
  moodScore: z.number().min(1).max(10),
  energyScore: z.number().min(1).max(10),
  tags: z.array(z.string()).max(5), // Max 5 tags
  reflection: z.string().max(280).optional(),
  isPrivate: z.boolean(),
});

export type CreateMoodCheckInInput = z.infer<typeof createMoodCheckInSchema>;
```

### 6.5 Journal Entry Validation
```typescript
export const createJournalEntrySchema = z.object({
  userId: z.string(),
  title: z.string().max(100).optional(),
  content: z.string().min(1), // Required
  tags: z.array(z.string()).max(5),
  isPrivate: z.boolean(),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
```

### 6.6 Appointment Validation
```typescript
export const createAppointmentSchema = z.object({
  familyId: z.string(),
  babyId: z.string().optional(),
  title: z.string().min(1).max(100),
  date: z.number(),
  time: z.number().optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
  type: z.enum(["pediatrician", "follow-up", "health-task", "other"]),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
```

---

## 7. Error Handling

### 7.1 Error Types
```typescript
export enum AppErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  NETWORK = "NETWORK",
  OFFLINE = "OFFLINE",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  UNKNOWN = "UNKNOWN",
}

export interface AppError {
  type: AppErrorType;
  message: string;
  details?: any;
}
```

### 7.2 Error Display Component
```typescript
interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// Specifications:
// - Shows error icon based on type
// - Shows error message (user-friendly)
// - Retry button for network errors
// - Dismiss button
// - Auto-dismiss after 5 seconds (optional)
```

### 7.3 Error Boundaries
```typescript
export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to Sentry
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## 8. Testing Specifications

### 8.1 Unit Testing

**Component Testing**
```typescript
// Example: FeedCard component test
describe("FeedCard", () => {
  it("renders feed details correctly", () => {
    const feed = {
      _id: "feed1",
      type: "bottle",
      bottle: { amount: 6, unit: "oz" },
      startTime: Date.now(),
      userId: "user1",
      createdAt: Date.now(),
    };

    const { getByText } = render(<FeedCard feed={feed} />);

    expect(getByText("6 oz")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const feed = { /* ... */ };

    const { getByTestId } = render(<FeedCard feed={feed} onPress={onPress} />);

    fireEvent.press(getByTestId("feed-card"));
    expect(onPress).toHaveBeenCalled();
  });
});
```

**Hook Testing**
```typescript
// Example: useFeeds hook test
describe("useFeeds", () => {
  it("fetches feeds for baby", async () => {
    const { result, waitFor } = renderHook(() => useFeeds("baby1"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(5);
  });
});
```

### 8.2 Integration Testing

**User Flow Testing**
```typescript
describe("Feed Flow", () => {
  it("creates feed and shows in dashboard", async () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Navigate to feed tracker
    fireEvent.press(getByText("Trackers"));
    fireEvent.press(getByText("Feed"));

    // Fill form
    fireEvent.press(getByText("Log Bottle"));
    fireEvent.changeText(getByPlaceholderText("Amount"), "6");

    // Save
    fireEvent.press(getByText("Save"));

    // Verify
    await waitFor(() => {
      expect(getByText("6 oz")).toBeTruthy();
    });
  });
});
```

### 8.3 E2E Testing (Detox)

**Critical User Journey**
```typescript
describe("New User Onboarding", () => {
  it("completes onboarding flow", async () => {
    await device.launchApp();

    // Register
    await element(by.id("email-input")).typeText("user@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("register-button")).tap();

    // Create family
    await element(by.id("baby-name-input")).typeText("Baby Emma");
    await element(by.id("birth-date-picker")).tap();
    await element(by.text("OK")).tap();
    await element(by.id("create-family-button")).tap();

    // Verify dashboard
    await expect(element(by.text("Good morning, user@example.com"))).toBeVisible();
  });
});
```

### 8.4 Test Coverage Targets

- **Core Business Logic:** 90%+
- **UI Components:** 80%+
- **Critical User Flows:** 100%
- **Overall:** 75%+

---

## 9. Performance Specifications

### 9.1 Load Time Targets

| Screen | Target | Max |
|--------|--------|-----|
| App Launch | <1.5s | 2s |
| Dashboard Load | <1s | 1.5s |
| Tracker Load | <500ms | 1s |
| Mood Check-In | <500ms | 1s |

### 9.2 API Response Time Targets

| Operation | Target | Max |
|-----------|--------|-----|
| Query (read) | <200ms | 500ms |
| Mutation (write) | <100ms | 200ms |
| Real-time sync | <1s | 2s |

### 9.3 Memory Targets

- **Idle Memory:** <150MB
- **Peak Memory:** <300MB
- **Leak Detection:** No memory leaks over 1 hour of usage

### 9.4 Bundle Size Targets

- **Total Bundle:** <50MB
- **JavaScript Bundle:** <5MB
- **Assets:** <10MB

---

## 10. Accessibility Specifications

### 10.1 WCAG 2.1 AA Compliance

- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Touch Targets:** Minimum 44x44 pixels
- **Semantic Labels:** All interactive elements have accessibility labels
- **Focus Indicators:** Visible focus states for all interactive elements
- **Screen Reader Support:** All content is accessible via VoiceOver/TalkBack

### 10.2 Accessibility Testing

- Use React Native Accessibility Inspector
- Manual testing with VoiceOver (iOS) and TalkBack (Android)
- Automated testing with react-native-ax

---

## 11. Internationalization (i18n) Specifications

### 11.1 Supported Languages (MVP)

- English (US) - Primary

### 11.2 Future Languages (Post-MVP)

- Spanish
- French
- German
- Portuguese (Brazil)
- Mandarin Chinese

### 11.3 Implementation

- Use `i18next` for internationalization
- Externalize all user-facing strings
- Support RTL languages (Arabic, Hebrew) in future
- Date/time localization using `date-fns` locales

---

## 12. Analytics Specifications

### 12.1 Events to Track

**User Engagement**
- `app_opened`
- `feed_created`, `feed_updated`, `feed_deleted`
- `diaper_created`
- `sleep_created`
- `growth_created`
- `milestone_created`
- `mood_checkin_completed`
- `journal_entry_created`
- `affirmation_viewed`

**User Actions**
- `family_created`
- `invite_sent`
- `invite_accepted`
- `appointment_created`
- `appointment_completed`

**Performance**
- `screen_loaded` (with duration)
- `api_call` (with duration)
- `error_occurred` (with error type)

### 12.2 User Properties

- `user_id` (hashed)
- `family_id` (hashed)
- `plan_type` (free/premium)
- `app_version`
- `device_type` (ios/android)
- `locale`

### 12.3 Privacy

- No PII in analytics
- User opt-out for analytics
- GDPR compliant

---

## 13. Security Specifications

### 13.1 Authentication

- Password hashing with bcrypt
- Secure token storage (Expo SecureStore)
- Token refresh mechanism
- Session timeout: 7 days
- Logout on token expiration

### 13.2 Authorization

- Role-based access control (RBAC)
- Permission checks on all mutations
- Family-level data isolation

### 13.3 Data Protection

- TLS 1.3 in transit
- AES-256 at rest
- Sensitive fields encrypted at application level (optional)

### 13.4 Audit Trail

- Log all mutations (create, update, delete)
- Include: user, timestamp, operation, details
- Immutable audit log

---

## 14. Deployment Specifications

### 14.1 Build Configurations

**Development**
- Expo Go (development client)
- Hot reloading enabled
- Debug builds

**Preview**
- TestFlight (iOS)
- Internal testing (Android)
- Staging environment

**Production**
- App Store (iOS)
- Google Play Store (Android)
- Production environment

### 14.2 Versioning

- Semantic versioning: MAJOR.MINOR.PATCH
- Example: 1.0.0, 1.1.0, 1.1.1
- Increment based on changes:
  - MAJOR: Breaking changes
  - MINOR: New features (backward compatible)
  - PATCH: Bug fixes

### 14.3 Release Process

1. Create release branch from `main`
2. Update version number
3. Run all tests
4. Build with EAS
5. Test on real devices
6. Submit to app stores
7. Monitor for issues
8. Merge release to `main`

---

## 15. Open Questions & Future Work

### 15.1 Open Questions

1. Should we implement application-level encryption for sensitive fields?
2. What charting library for analytics? Victory Native or Recharts?
3. Should we support offline photo uploads?

### 15.2 Future Enhancements

- **Biometric Auth:** Face ID/Touch ID for quick access
- **Deep Linking:** Navigate to specific screens from links
- **Background Sync:** Sync when app is in background
- **Push Notifications:** For reminders and partner updates
- **Advanced Analytics:** Correlations between sleep, mood, feeds
- **Export Features:** CSV/PDF export of data
- **Integration:** With pediatricians, therapists

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Next Review:** During development sprint planning

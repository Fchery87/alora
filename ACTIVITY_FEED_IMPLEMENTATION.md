# ActivityFeed Component Implementation

## Summary

Successfully created a real-time Activity Feed component that integrates with the Dashboard to show recent baby-related activities from family members.

## Files Created

### 1. `hooks/useActivityFeed.ts`

**Purpose**: Custom hook for aggregating real-time activity data from multiple Convex tables.

**Features**:

- Uses Convex's `useQuery` for real-time subscriptions
- Aggregates data from 6 sources:
  - Feeds (breast, formula, solid)
  - Diapers (wet, solid, both, mixed)
  - Sleep (naps, night, day)
  - Milestones (celebrated milestones)
  - Mood check-ins
  - Journal entries
- Fetches user information to display who logged each activity
- Groups activities by time period (Today, Yesterday, Earlier)
- Returns normalized `ActivityItem` objects with consistent structure

**Key Functions**:

- `useActivityFeed(babyId, limit)` - Main hook that returns activities and grouped activities
- `getRelativeTime(timestamp)` - Helper for converting timestamps to relative time strings

**Data Structure**:

```typescript
interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: Id<"users">;
  userName?: string;
  userAvatarUrl?: string;
  timestamp: number;
  message: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  babyId?: Id<"babies">;
  babyName?: string;
}
```

### 2. `components/organisms/ActivityFeed.tsx`

**Purpose**: Main UI component for displaying the activity feed with beautiful animations.

**Features**:

- ✅ Real-time updates via Convex subscriptions
- ✅ Time-grouped activities (Today, Yesterday, Earlier)
- ✅ User avatars with initials (if no photo)
- ✅ Color-coded activity icons with backgrounds
- ✅ Relative time display ("2 min ago", "1h ago")
- ✅ Staggered fade-in animations for new items
- ✅ Pull-to-refresh functionality
- ✅ Empty state with call-to-action
- ✅ Live indicator when data is updated
- ✅ Loading skeleton states
- ✅ Soft card style with subtle shadows

**Design Elements**:

- Clean, modern card design with 20px border radius
- Subtle shadows for depth
- Icon backgrounds with soft pastel colors matching activity types
- Smooth animations using React Native's Animated API
- Live indicator with pulsing dot animation
- Responsive layout with proper spacing

**Activity Types & Styling**:

- **Feed** (Orange): Restaurant icon, `#ea580c` / `#ffedd5`
- **Diaper** (Blue): Water icon, `#2563eb` / `#dbeafe`
- **Sleep** (Purple): Moon icon, `#7c3aed` / `#ede9fe`
- **Milestone** (Red): Trophy icon, `#dc2626` / `#fee2e2`
- **Mood** (Pink): Heart icon, `#ec4899` / `#fce7f3`
- **Journal** (Cyan): Book icon, `#0891b2` / `#cffafe`

### 3. `convex/functions/users/index.ts`

**Purpose**: Convex backend functions for user data.

**Functions**:

- `get()` - Get current user
- `getUsersByIds(userIds)` - Batch fetch users by IDs
- `list()` - List users (placeholder for family member listing)

### 4. `__tests__/components/ActivityFeed.test.tsx`

**Purpose**: Unit tests for the ActivityFeed component.

**Test Cases**:

- Renders empty state when no activities
- Renders loading skeleton
- Displays activities grouped by time
- Shows live indicator when activity exists

## Files Modified

### 1. `components/organisms/Dashboard.tsx`

**Changes**:

- Added `activityFeed?: ReactNode` prop to interface
- Updated component to render `activityFeed` prop if provided
- Falls back to existing empty state if no prop

### 2. `app/(tabs)/dashboard.tsx`

**Changes**:

- Imported `ActivityFeed` component
- Added `ActivityFeed` as child to `Dashboard` component
- Passed `limit={10}` to show 10 most recent activities
- Prepared `babyId` placeholder for future integration

## Integration

### How the Data Flows

1. **Dashboard Page** (`app/(tabs)/dashboard.tsx`)

   - Renders `Dashboard` component
   - Passes `<ActivityFeed babyId={undefined} limit={10} />` as prop

2. **Dashboard Component** (`components/organisms/Dashboard.tsx`)

   - Receives `activityFeed` prop
   - Renders it in the "Recent Activity" section
   - Falls back to empty state if not provided

3. **ActivityFeed Component** (`components/organisms/ActivityFeed.tsx`)

   - Uses `useActivityFeed` hook to fetch data
   - Displays activities with animations
   - Handles loading, empty, and populated states

4. **useActivityFeed Hook** (`hooks/useActivityFeed.ts`)
   - Makes 6 parallel Convex queries
   - Fetches user data in batch
   - Transforms and groups data
   - Returns normalized activities

### Real-Time Updates

The activity feed automatically updates in real-time because:

1. All data queries use Convex's `useQuery` hook
2. Convex automatically subscribes to database changes
3. When new feeds, diapers, sleep, milestones, mood check-ins, or journal entries are added
4. The hook automatically re-runs and returns updated data
5. The component re-renders with the new activities
6. A subtle "live" indicator pulses to show updates

## Design Patterns Used

1. **Separation of Concerns**:

   - Data fetching in hook
   - UI logic in component
   - Backend functions in Convex

2. **Real-Time Architecture**:

   - Convex's built-in real-time subscriptions
   - No manual polling needed

3. **Responsive Design**:

   - Flexible layouts using Flexbox
   - Proper spacing and margins
   - Touch-friendly interactive elements

4. **Performance Optimizations**:

   - Batch user fetching
   - Memoized transformations
   - Efficient animations using native driver

5. **User Experience**:
   - Loading states to prevent UI jumps
   - Empty states with clear CTAs
   - Relative time for better readability
   - Visual feedback (live indicator) for updates

## Future Enhancements

1. **Navigation**:

   - Tap on activity to navigate to details
   - Link to baby profile for specific activities

2. **Filtering**:

   - Filter by activity type
   - Filter by family member
   - Date range picker

3. **Personalization**:

   - Customize which activity types to show
   - Set activity feed preferences

4. **Notifications**:

   - Push notifications for new activities
   - In-app notifications badge

5. **Accessibility**:
   - Screen reader support
   - High contrast mode
   - Reduced motion option

## Testing

Run the component tests with:

```bash
bun test __tests__/components/ActivityFeed.test.tsx
```

## Usage Example

```tsx
import { ActivityFeed } from "@/components/organisms/ActivityFeed";

function MyScreen() {
  return (
    <View>
      <ActivityFeed
        babyId="your-baby-id"
        limit={20}
        onRefresh={() => console.log("Refresh triggered")}
        refreshing={false}
      />
    </View>
  );
}
```

## Props

| Prop         | Type                  | Required | Description                                        |
| ------------ | --------------------- | -------- | -------------------------------------------------- |
| `babyId`     | `string \| undefined` | No       | ID of the baby to show activities for              |
| `limit`      | `number`              | No       | Maximum number of activities to show (default: 20) |
| `onRefresh`  | `() => void`          | No       | Callback for pull-to-refresh                       |
| `refreshing` | `boolean`             | No       | Whether a refresh is in progress                   |

## Dependencies

- React Native core components
- Expo vector icons
- Convex (react client)
- Clerk (for authentication)

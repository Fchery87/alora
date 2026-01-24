# ActivityFeed - Quick Start Guide

## What Was Created

### New Files (4)
1. `components/organisms/ActivityFeed.tsx` - Main UI component (10KB)
2. `hooks/useActivityFeed.ts` - Data aggregation hook (7.5KB)
3. `convex/functions/users/index.ts` - Backend user functions (773B)
4. `__tests__/components/ActivityFeed.test.tsx` - Test suite (3.1KB)

### Modified Files (2)
1. `components/organisms/Dashboard.tsx` - Added activityFeed prop
2. `app/(tabs)/dashboard.tsx` - Integrated ActivityFeed

## Basic Usage

```tsx
import { ActivityFeed } from "@/components/organisms/ActivityFeed";

// Show 10 most recent activities
<ActivityFeed limit={10} />

// Filter by baby
<ActivityFeed babyId="baby-id-here" limit={20} />

// With refresh
<ActivityFeed 
  limit={15}
  onRefresh={handleRefresh}
  refreshing={isRefreshing}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `babyId` | `string \| undefined` | `undefined` | Filter by baby |
| `limit` | `number` | `20` | Max activities to show |
| `onRefresh` | `function` | - | Pull-to-refresh callback |
| `refreshing` | `boolean` | `false` | Refresh in progress |

## Features Out of the Box

✅ Real-time updates (Convex subscriptions)
✅ Time grouping (Today, Yesterday, Earlier)
✅ User avatars with initials
✅ Color-coded activity icons
✅ Empty state with CTA
✅ Loading skeletons
✅ Pull-to-refresh
✅ Smooth animations
✅ Live indicator

## Activity Types Supported

- 🍽️ Feeds (breast, formula, solid)
- 💧 Diapers (wet, solid, both, mixed)
- 🌙 Sleep (naps, night, day)
- 🏆 Milestones (celebrated)
- ❤️ Mood check-ins
- 📖 Journal entries

## Integration Steps

### 1. Import component
```tsx
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
```

### 2. Add to dashboard
```tsx
<Dashboard 
  activityFeed={<ActivityFeed limit={10} />}
  // ...other props
/>
```

### 3. (Optional) Add babyId
```tsx
// Get babyId from your data layer
const babyId = useCurrentBaby()?.id;

<ActivityFeed babyId={babyId} limit={10} />
```

## Styling

Component uses internal styles. No need to provide custom styles.

### Color Palette
- Feed: Orange (#ea580c)
- Diaper: Blue (#2563eb)
- Sleep: Purple (#7c3aed)
- Milestone: Red (#dc2626)
- Mood: Pink (#ec4899)
- Journal: Cyan (#0891b2)

## Testing

Run component tests:
```bash
bun test __tests__/components/ActivityFeed.test.tsx
```

## Troubleshooting

### No activities showing
- Check if babyId is correct
- Verify Convex is connected
- Check browser console for errors

### Real-time not working
- Ensure Convex dev server is running
- Check network connection
- Verify authentication

### Styles look wrong
- Check that Expo Vector Icons are installed
- Verify React Native version compatibility

## Next Steps

1. Add baby selector in dashboard
2. Add navigation to activity details
3. Add filter controls
4. Add infinite scroll
5. Add push notifications

---

**Need help?** Check `ACTIVITY_FEED_IMPLEMENTATION.md` for full documentation.

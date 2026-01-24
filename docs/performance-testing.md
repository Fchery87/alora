# Performance Testing Guide

This document outlines performance testing procedures for Alora.

## Performance Metrics

### Target Metrics (iOS/Android)

| Metric            | Target      | Critical Threshold |
| ----------------- | ----------- | ------------------ |
| App Launch Time   | < 3 seconds | < 5 seconds        |
| Screen Transition | < 300ms     | < 500ms            |
| API Response Time | < 200ms     | < 500ms            |
| Memory Usage      | < 150MB     | < 200MB            |
| Battery Impact    | Minimal     | Moderate           |
| Bundle Size       | < 50MB      | < 80MB             |

### Performance Testing Tools

1. **React Native Performance Monitor**

   - FPS monitoring (60fps target)
   - JS and UI thread performance
   - Memory usage tracking

2. **Flipper**

   - Network request timing
   - Database query performance
   - State management overhead

3. **Xcode Instruments (iOS)**

   - Time Profiler
   - Allocations
   - Core Animation FPS

4. **Android Studio Profiler**
   - CPU usage
   - Memory allocations
   - Network activity

## Performance Tests

### 1. App Launch Performance

```bash
# Measure cold start time
time xcrun simctl boot "iPhone 15 Pro"
time adb shell am start -W -n com.alora.app/.MainActivity
```

**Acceptable: < 3 seconds**

### 2. Memory Leak Detection

Run the app through a series of screens and monitor memory:

1. Open Dashboard → Trackers → Dashboard (10x)
2. Open Wellness → Journal → Settings (5x)
3. Check memory after each cycle

**Acceptable: Memory should stabilize, not grow indefinitely**

### 3. Large Dataset Performance

Test with 1000+ entries:

- Feed entries: 500+
- Diaper changes: 300+
- Sleep records: 100+
- Journal entries: 100+

**Acceptable: UI remains responsive, no jank**

### 4. Animation Performance

Test all animations:

- Screen transitions
- Modal animations
- Chart renders
- Activity feed updates

**Acceptable: 60fps, no dropped frames**

## Performance Optimization Strategies

### 1. Lazy Loading

- Load chart data only when visible
- Implement pagination for activity feeds
- Defer non-critical animations

### 2. Memoization

- Use React.memo() for expensive components
- Use useMemo() for computed values
- Use useCallback() for event handlers

### 3. Image Optimization

- Use appropriate image sizes
- Implement lazy loading for images
- Cache images locally

### 4. Database Optimization

- Index frequently queried fields
- Implement pagination
- Use Convex's built-in pagination

### 5. Bundle Size

- Tree-shake unused code
- Lazy load routes
- Compress assets

## Performance Checklist

- [ ] App launches in < 3 seconds
- [ ] All screens load in < 500ms
- [ ] Animations run at 60fps
- [ ] Memory usage < 150MB
- [ ] No memory leaks after extensive use
- [ ] API calls complete in < 200ms
- [ ] Offline data syncs correctly
- [ ] Bundle size < 50MB

## Running Performance Tests

```bash
# Start the app with performance monitoring
npm run start

# Run memory leak tests
npm run test:memory

# Run animation performance tests
npm run test:animation

# Generate performance report
npm run test:performance
```

## Monitoring in Production

### Analytics Events to Track

```typescript
// Track screen performance
useEffect(() => {
  const start = Date.now();
  return () => {
    const duration = Date.now() - start;
    analytics.track("screen_render_time", {
      screen: "Dashboard",
      duration_ms: duration,
    });
  };
}, []);

// Track API performance
const { data } = useQuery({
  queryFn: async () => {
    const start = Date.now();
    const result = await fetchData();
    const duration = Date.now() - start;
    analytics.track("api_call_duration", {
      endpoint: "feeds",
      duration_ms: duration,
    });
    return result;
  },
});
```

### Crash Reporting

- Implement Sentry or similar for crash reporting
- Track ANR (Application Not Responding) events
- Monitor memory warning events

## Continuous Performance Monitoring

1. **Daily Performance Tests**

   - Automated launch time tests
   - Memory footprint tests

2. **Weekly Performance Reviews**

   - Analyze production metrics
   - Identify regressions
   - Optimize top bottlenecks

3. **Monthly Performance Audits**
   - Full performance suite
   - Bundle size analysis
   - Memory profiling
   - Battery impact analysis

# Expo SDK 50 → 54 Migration Plan

**Strategy:** Complete Upgrade Before Production  
**Date:** 2026-02-02  
**Risk Level:** HIGH but necessary for long-term stability

---

## 📋 Migration Checklist

### Phase 1: Core Framework Updates

#### 1. Expo SDK 50 → 54

**Packages to update:**

- `expo`: 50.0.21 → 54.0.33
- All `expo-*` packages to SDK 54 compatible versions

**Breaking Changes:**

- Minimum iOS deployment target: 15.1
- Minimum Android SDK: 24 (Android 7.0)
- New Metro config requirements
- SplashScreen API changes
- Notifications API changes

#### 2. React Native 0.73 → 0.83

**Packages to update:**

- `react-native`: 0.73.6 → 0.83.1

**Breaking Changes:**

- New Architecture (Bridgeless) changes
- Android 14 support
- iOS 17+ minimum
- Linking API changes
- DevMenu changes

#### 3. React 18 → 19

**Packages to update:**

- `react`: 18.2.0 → 19.0.0
- `react-dom`: 18.2.0 → 19.0.0
- `@types/react`: 18.2.79 → 19.0.0
- `@types/react-test-renderer`: 18.3.0 → 19.0.0

**Breaking Changes:**

- New JSX Transform (automatic in 19)
- useId hook changes
- form action changes
- Suspense improvements

---

### Phase 2: Native Module Updates

#### 4. React Native Gesture Handler

- `react-native-gesture-handler`: 2.14.0 → 2.23.0

#### 5. React Native Reanimated

- `react-native-reanimated`: 3.6.2 → 3.16.7

#### 6. React Native Screens

- `react-native-screens`: 3.29.0 → 4.9.0

#### 7. React Native Safe Area Context

- `react-native-safe-area-context`: 4.8.2 → 5.4.0

#### 8. React Native SVG

- `react-native-svg`: 14.1.0 → 15.11.0

---

### Phase 3: Styling & UI Updates

#### 9. TailwindCSS 3 → 4

- `tailwindcss`: 3.4.17 → 4.0.6

**Breaking Changes:**

- New CSS-first configuration
- No tailwind.config.js needed (uses CSS)
- Different plugin system
- Some utility changes

#### 10. NativeWind

- `nativewind`: 4.2.1 → 4.2.1 (check for 4.3+)
- `react-native-css-interop`: 0.2.1 → latest

---

### Phase 4: Development Tooling

#### 11. ESLint 8 → 9 (Flat Config)

- `eslint`: 8.57.0 → 9.19.0
- `@typescript-eslint/*`: 7.18.0 → 8.22.0
- `eslint-config-expo`: 7.0.0 → 10.0.0
- `eslint-plugin-react-hooks`: 4.6.2 → 5.1.0
- `eslint-plugin-react-native`: 4.1.0 → 5.0.0

**Breaking Changes:**

- New flat config format (eslint.config.js)
- Different plugin structure
- Changes to rule configurations

#### 12. TypeScript

- `typescript`: 5.4.5 → 5.7.3 (latest stable)

#### 13. Vite / Vitest

- `vitest`: 0.34.6 → 3.0.5
- `@vitejs/plugin-react`: 4.3.2 → 4.3.4

---

### Phase 5: Third-Party Libraries

#### 14. Clerk

- `@clerk/clerk-expo`: 2.19.21 → 2.23.0
- Check for Expo SDK 54 compatibility

#### 15. TanStack Query

- `@tanstack/react-query`: 5.90.20 → 5.66.0

#### 16. Convex

- `convex`: 1.31.6 → 1.31.7 (or latest)

#### 17. Moti

- `moti`: 0.30.0 → latest (check Reanimated compatibility)

#### 18. Victory Native

- `victory-native`: 36.9.2 → 41.16.1

**Breaking Changes:**

- New API (v40+ is a complete rewrite)
- Different chart configuration
- May require significant code changes

#### 19. Zustand

- `zustand`: 4.5.5 → 5.0.3

#### 20. Sentry

- `@sentry/react-native`: 7.11.0 → 7.20.0

---

## 🚨 Critical Breaking Changes to Address

### 1. Victory Native V40+ Rewrite

**Issue:** Victory Native 40+ is a complete API rewrite  
**Options:**

- Option A: Update to v41 and rewrite all charts (time-consuming)
- Option B: Keep v36.9.2 for now, migrate later
- Option C: Replace with alternative (react-native-chart-kit, recharts)

**Recommendation:** Option B - Keep current version, create migration issue for later

### 2. TailwindCSS v4 CSS-First Config

**Issue:** Tailwind 4 uses CSS-based config, not JS  
**Action:** Keep v3.4.17 for now  
**Reason:** NativeWind may not fully support v4 yet

### 3. ESLint 9 Flat Config Migration

**Issue:** Completely different config format  
**Action:** Major undertaking, defer until after production  
**Alternative:** Keep ESLint 8 for now

### 4. React 19 JSX Transform

**Issue:** React 19 changes JSX handling  
**Action:** Update babel and metro configs  
**Check:** Ensure all JSX files work correctly

---

## 📊 Testing Strategy

### After Each Phase:

1. ✅ `bun install` - Verify all packages resolve
2. ✅ `bun run typecheck` - No TypeScript errors
3. ✅ `bun run test` - All 189 tests pass
4. ✅ `bun run lint` - No critical lint errors
5. ✅ `bun run ios` - iOS build works
6. ✅ `bun run android` - Android build works
7. ✅ Manual smoke test - Login, baby creation, tracking

---

## 🎯 Execution Order

### Safe to Update Now (Low Risk):

1. ✅ Zustand 4 → 5
2. ✅ TanStack Query 5.90 → 5.66
3. ✅ Convex (latest patch)
4. ✅ Sentry (latest patch)
5. ✅ Moti (latest)
6. ✅ TypeScript 5.4 → 5.7
7. ✅ Vitest 0.34 → 3.x
8. ✅ @types/\* packages

### Medium Risk (Core Dependencies):

9. ⚠️ React Native Gesture Handler 2.14 → 2.23
10. ⚠️ React Native Safe Area Context 4.8 → 5.4
11. ⚠️ React Native Screens 3.29 → 4.9
12. ⚠️ React Native SVG 14.1 → 15.11
13. ⚠️ Clerk 2.19 → 2.23

### High Risk (Major Framework):

14. 🔴 Expo SDK 50 → 54 + all expo-\* packages
15. 🔴 React Native 0.73 → 0.83
16. 🔴 React 18 → 19
17. 🔴 React Native Reanimated 3.6 → 3.16

### Deferred (Too Risky):

18. ❌ TailwindCSS 3 → 4 (wait for NativeWind support)
19. ❌ ESLint 8 → 9 (wait for stable migration path)
20. ❌ Victory Native 36 → 41 (major API rewrite)

---

## 🛑 STOP Conditions

**Abort upgrade if:**

- iOS build fails with native module errors
- Android build fails with native module errors
- More than 10 tests fail
- Critical user flows break (login, tracking, navigation)
- Metro bundler shows unresolvable errors

**Rollback plan:**

- Keep git commits granular (one per phase)
- Can revert individual phases if needed
- Document any manual native module changes

---

## ✅ Success Criteria

**Migration successful when:**

- [ ] All packages updated to latest compatible versions
- [ ] No security vulnerabilities in `bun audit`
- [ ] TypeScript compilation: 0 errors
- [ ] Test suite: 189/189 passing
- [ ] iOS build: Success
- [ ] Android build: Success
- [ ] Login flow: Working
- [ ] Baby tracking: Working
- [ ] Calendar: Working
- [ ] Settings: Working
- [ ] No console errors in development
- [ ] Production build generates successfully

---

## 📅 Timeline Estimate

**Total Time:** 4-6 hours

- Phase 1 (Safe): 30 minutes
- Phase 2 (Medium): 1 hour
- Phase 3 (High): 2-3 hours
- Testing & Fixes: 1-2 hours

**Recommendation:** Start with safe updates, then tackle high-risk items one by one with full testing after each.

---

**Plan Status:** Ready to execute  
**Risk Level:** HIGH but manageable with careful testing  
**Rollback Plan:** Git commits per phase, can revert if needed

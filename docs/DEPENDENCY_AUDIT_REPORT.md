# Dependency Audit Report - Alora

**Date:** 2026-02-02  
**Auditor:** Project Validation System  
**Status:** ⚠️ ACTION REQUIRED

---

## Executive Summary

**CRITICAL FINDINGS:**

- 🔴 **6 Security Vulnerabilities** (2 High, 2 Moderate, 2 Low)
- 🟡 **47 Outdated Packages** (many major versions behind)
- 🟡 **Expo SDK 50** should be upgraded to SDK 54
- 🟢 **No Deprecated Packages** found
- 🟢 **Compatible Versions** (current combination works)

**Recommendation:**  
**DO NOT** upgrade to Expo 54/React Native 0.83 yet - too risky before production.  
**DO** patch security vulnerabilities and update compatible packages.

---

## 🔴 Security Vulnerabilities (CRITICAL)

### HIGH SEVERITY

#### 1. tar (≤7.5.2) - 3 Vulnerabilities

**Path:** `expo › @expo/cli › tar`  
**Issues:**

- Arbitrary File Overwrite and Symlink Poisoning
- Race Condition via Unicode Ligature Collisions
- Arbitrary File Creation via Hardlink Path Traversal

**Fix:** Update tar to ≥7.5.3 or upgrade Expo CLI

#### 2. semver (≥7.0.0 <7.5.2) - ReDoS

**Path:** Multiple dependencies  
**Issue:** Regular Expression Denial of Service  
**Fix:** Update semver to ≥7.5.2

### MODERATE SEVERITY

#### 3. @remix-run/server-runtime (≤2.17.2) - CSRF

**Path:** `expo-router › @expo/server › @remix-run/node`  
**Issue:** React Router CSRF vulnerability  
**Fix:** Update @remix-run/server-runtime to ≥2.17.3

#### 4. lodash (≥4.0.0 ≤4.17.22) - Prototype Pollution

**Path:** Multiple dependencies (detox, victory-native, clerk, expo)  
**Issue:** Prototype Pollution in `_.unset` and `_.omit`  
**Fix:** Update lodash to ≥4.17.23 or use npm overrides

### LOW SEVERITY

#### 5. send (<0.19.0) - XSS

**Path:** `expo › @expo/cli › send`  
**Issue:** Template injection leading to XSS  
**Fix:** Update send to ≥0.19.0

#### 6. diff (≥6.0.0 <8.0.3) - DoS

**Path:** `detox › mocha › diff`  
**Issue:** Denial of Service in parsePatch/applyPatch  
**Fix:** Update diff to ≥8.0.3

---

## 🟡 Outdated Packages Analysis

### Critical Framework Updates (MAJOR VERSIONS)

| Package      | Current | Latest  | Impact  | Recommendation                     |
| ------------ | ------- | ------- | ------- | ---------------------------------- |
| expo         | 50.0.21 | 54.0.33 | 🔴 HIGH | **Wait** - too close to production |
| react-native | 0.73.6  | 0.83.1  | 🔴 HIGH | **Wait** - major breaking changes  |
| react        | 18.2.0  | 19.2.4  | 🔴 HIGH | **Wait** - React 19 changes        |
| @types/react | 18.2.79 | 19.2.10 | 🔴 HIGH | Match React version                |

### Expo SDK Compatibility Matrix

**Current:** Expo SDK 50 (January 2024)  
**Latest:** Expo SDK 54 (January 2025)

**SDK 50 Components:**

- React Native 0.73.x ✅
- React 18.2.x ✅
- Metro 0.80.x ✅

**Breaking Changes in SDK 51+:**

- React Native 0.74+ (new architecture changes)
- Android 14 support requirements
- iOS 17+ minimum deployment target
- Navigation changes in expo-router

### Recommended Updates (SDK 50 Compatible)

#### ✅ SAFE TO UPDATE (Patch/Minor)

| Package                       | Current | Latest  | Action                               |
| ----------------------------- | ------- | ------- | ------------------------------------ |
| @clerk/clerk-expo             | 2.15.0  | 2.19.21 | Update ✅                            |
| @tanstack/react-query         | 5.60.6  | 5.90.20 | Update ✅                            |
| @testing-library/react-native | 12.4.5  | 13.3.3  | **Wait** - may have breaking changes |
| convex                        | 1.17.4  | 1.31.7  | Update ✅                            |
| moti                          | 0.30.0  | 0.30.0  | Check for updates ✅                 |
| zustand                       | 4.5.5   | 5.0.3   | **Research** - major version         |
| tailwindcss                   | 3.4.17  | 4.0.x   | **Wait** - v4 has breaking changes   |
| nativewind                    | 4.2.1   | 4.2.x   | Update ✅                            |
| victory-native                | 36.9.2  | 37.x    | **Research** - chart API changes     |
| svix                          | 1.84.1  | 1.x     | Update ✅                            |

#### ⚠️ REQUIRES TESTING

| Package               | Current      | Latest  | Risk                             |
| --------------------- | ------------ | ------- | -------------------------------- |
| eslint                | 8.57.0       | 9.39.2  | **HIGH** - Flat config changes   |
| @typescript-eslint/\* | 7.18.0       | 8.54.0  | **HIGH** - Breaking changes      |
| detox                 | 18.23.2-next | 20.47.0 | **MEDIUM** - E2E testing changes |
| vitest                | 0.34.6       | 3.x     | **MEDIUM** - Major version gap   |

---

## 🟢 Compatibility Check

### Current Stack Compatibility ✅

**Verified Working Combinations:**

- ✅ Expo SDK 50 + React Native 0.73.6
- ✅ React 18.2.0 + React Native 0.73.6
- ✅ NativeWind 4.2.1 + TailwindCSS 3.4.17
- ✅ Clerk 2.15.0 + Expo 50
- ✅ Convex 1.17.4 + React Native 0.73
- ✅ Reanimated 3.6.2 + Expo 50
- ✅ Victory Native 36.9.2 + React Native 0.73

### Peer Dependencies Status ✅

All peer dependencies resolve correctly:

- react: 18.2.0 (✅ satisfies all)
- react-native: 0.73.6 (✅ satisfies all)
- expo: 50.0.21 (✅ satisfies all)

### Native Module Compatibility ✅

All native modules have compatible versions:

- expo-secure-store: 12.8.1 ✅
- expo-local-authentication: 13.8.0 ✅
- expo-notifications: 0.27.8 ✅
- react-native-reanimated: 3.6.2 ✅
- react-native-gesture-handler: 2.14.0 ✅

---

## 📋 Recommended Action Plan

### Phase 1: Security Patches (URGENT - Do Now)

Update these specific packages to fix vulnerabilities:

```bash
# Fix tar vulnerability
bun update tar@latest

# Fix semver vulnerability (transitive)
bun update semver@7.5.4

# Fix lodash vulnerability (transitive)
bun update lodash@4.17.21

# Fix send vulnerability (transitive)
bun update send@0.19.0

# Fix diff vulnerability (dev dependency)
bun update diff@8.0.3
```

Or add to package.json overrides:

```json
"overrides": {
  "tar": "^7.5.4",
  "semver": "^7.5.4",
  "lodash": "^4.17.21",
  "send": "^0.19.0",
  "diff": "^8.0.3"
}
```

### Phase 2: Safe Updates (Before Production)

Update these packages (low risk, high value):

```bash
# Core functionality
bun update @clerk/clerk-expo
bun update convex
bun update @tanstack/react-query
bun update svix

# Expo modules (keep SDK 50 compatible versions)
bun update @expo/vector-icons
bun update expo-sharing

# Dev dependencies
bun update prettier
bun update lint-staged
bun update husky
```

### Phase 3: Post-Production Upgrade (After Launch)

**DO NOT DO THIS NOW** - Schedule for after production launch:

1. **Expo SDK 51 → 54 Migration**

   - Update Expo SDK to 54
   - Update React Native to 0.83
   - Update React to 19
   - Update all expo-\* packages
   - Full regression testing
   - iOS/Android build validation

2. **ESLint 8 → 9 Migration**

   - Migrate to Flat Config
   - Update all eslint plugins
   - Test all lint rules

3. **Major Version Updates**
   - TailwindCSS 3 → 4
   - Zustand 4 → 5
   - Testing Library 12 → 13
   - Victory Native 36 → 37

---

## 🧪 Testing Requirements

After any updates, verify:

1. ✅ TypeScript compilation: `bun run typecheck`
2. ✅ Unit tests: `bun run test` (189 tests must pass)
3. ✅ Lint checks: `bun run lint`
4. ✅ iOS build: `bun run ios` (smoke test)
5. ✅ Android build: `bun run android` (smoke test)
6. ✅ Critical user flows:
   - Login/logout
   - Baby creation
   - Activity tracking (feeds, diapers, sleep)
   - Calendar view
   - Data export
   - Settings

---

## 📊 Risk Assessment

| Action                  | Risk Level | Timeline    | Recommendation |
| ----------------------- | ---------- | ----------- | -------------- |
| Security patches        | 🟢 Low     | Immediate   | **DO NOW**     |
| Minor updates (Phase 2) | 🟡 Medium  | This week   | **Safe to do** |
| Expo SDK upgrade        | 🔴 High    | Post-launch | **Wait**       |
| React 19 upgrade        | 🔴 High    | Post-launch | **Wait**       |
| Tailwind v4 upgrade     | 🔴 High    | Post-launch | **Wait**       |

---

## 🎯 Final Recommendation

### DO NOW (Before Production):

1. ✅ Apply security patches (npm overrides)
2. ✅ Update safe packages (Phase 2 list)
3. ✅ Run full test suite
4. ✅ Build iOS/Android to verify

### DO NOT DO (Until After Production):

1. ❌ Upgrade Expo SDK 50 → 54
2. ❌ Upgrade React Native 0.73 → 0.83
3. ❌ Upgrade React 18 → 19
4. ❌ Upgrade TailwindCSS 3 → 4
5. ❌ Upgrade ESLint 8 → 9

### RATIONALE:

You're at 97% production readiness with a **working, tested system**. Major framework upgrades this close to launch introduce:

- Breaking changes risk
- New untested bugs
- Extended QA cycles
- Potential App Store rejection

**Ship with current versions, upgrade after launch.**

---

## 📞 References

- [Expo SDK 50 Documentation](https://docs.expo.dev/versions/v50.0.0/)
- [React Native 0.73 Documentation](https://reactnative.dev/docs/0.73/getting-started)
- [Expo SDK 51 Breaking Changes](https://expo.dev/changelog/2024/05-07-sdk-51)
- [CVE Database](https://cve.mitre.org/)
- [npm Security Advisories](https://www.npmjs.com/advisories)

---

**Report Generated:** 2026-02-02  
**Next Audit:** Post-production upgrade phase

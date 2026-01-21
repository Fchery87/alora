# Alora Technical Design - Updated Stack

## 1. Executive Summary

This document outlines the technical implementation of Alora using a modern, production-ready tech stack optimized for React Native Expo. The design prioritizes beautiful UI, smooth animations, robust security, and seamless real-time sync.

**Last Updated:** January 19, 2026
**Version:** 2.0

---

## 2. Complete Technology Stack

### 2.1 Core Framework
- **Platform:** React Native 0.73+
- **Runtime:** Expo SDK 50+
- **Language:** TypeScript 5.0+
- **Package Manager:** Bun 1.0+

### 2.2 Authentication & Security
- **Auth Provider:** Clerk (React Native SDK)
- **Session Management:** Clerk Session (JWT tokens)
- **Token Storage:** expo-secure-store (encrypted keychain)
- **Field Encryption:** expo-crypto (AES-256-GCM) + LargeSecureStore pattern
- **Password Handling:** Clerk-managed (never stored locally)

### 2.3 UI & Animations
- **Component Library:** React Native Reusables (built on Tamagui)
- **Styling Engine:** Tamagui (@tamagui/core)
- **Animations:** Reanimated 3.x + Moti
- **Icons:** @expo/vector-icons (Ionicons)
- **Gestures:** React Native Gesture Handler

### 2.4 State Management & Data
- **Server State:** React Query (TanStack Query)
- **Client State:** Zustand
- **Backend:** Convex (real-time database)
- **Real-time Sync:** Convex Subscriptions
- **Offline Support:** Convex offline queue + React Query optimistic updates

### 2.5 Data Visualization
- **Charting Library:** Victory Native
- **Analytics:** Custom hooks for trend calculation
- **Growth Standards:** WHO percentile calculations

### 2.6 Development & Tooling
- **Testing:** Vitest + React Native Testing Library + Detox (E2E)
- **Linting:** ESLint + TypeScript ESLint
- **Formatting:** Prettier
- **Pre-commit:** Husky + lint-staged
- **CI/CD:** GitHub Actions
- **Error Tracking:** Sentry

### 2.7 Deployment
- **Build System:** Expo Application Services (EAS)
- **Distribution:** App Store + Google Play
- **Over-the-Air Updates:** Expo Updates

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   iOS App    │  │ Android App  │  │  Web App     │   │
│  │  (Expo)     │  │  (Expo)     │  │  (Optional)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘   │
│         │                  │                  │            │
│         └────────┬─────────┴──────────────────┘            │
│                  │                                       │
│         ┌────────▼────────────────────────┐                │
│         │     Clerk Auth SDK              │                │
│         │  - Session Management           │                │
│         │  - User Identity               │                │
│         │  - Organization (Family)        │                │
│         └────────┬────────────────────────┘                │
│                  │                                       │
│         ┌────────▼────────────────────────┐                │
│         │  State Management               │                │
│         │  - React Query (Server)        │                │
│         │  - Zustand (Client)           │                │
│         └────────┬────────────────────────┘                │
│                  │                                       │
│         ┌────────▼────────────────────────┐                │
│         │  UI Layer                      │                │
│         │  - React Native Reusables      │                │
│         │  - Reanimated + Moti           │                │
│         │  - Victory Native              │                │
│         └────────┬────────────────────────┘                │
└──────────────────┼─────────────────────────────────────────┘
                   │
                   │ JWT Token (Clerk)
                   │
┌──────────────────▼─────────────────────────────────────────┐
│                  Backend Layer                             │
│                                                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │         Clerk External Auth Integration          │       │
│  │  - Verify JWT                                 │       │
│  │  - Extract user identity                       │       │
│  │  - Map organizations → families               │       │
│  └───────────────────┬──────────────────────────────┘       │
│                      │                                       │
│  ┌───────────────────▼──────────────────────────────┐       │
│  │              Convex Backend                      │       │
│  │                                                  │       │
│  │  ┌──────────────┐  ┌──────────────┐            │       │
│  │  │   Queries    │  │  Mutations   │            │       │
│  │  │   (Read)     │  │  (Write)     │            │       │
│  │  └──────────────┘  └──────────────┘            │       │
│  │                                                  │       │
│  │  ┌──────────────┐  ┌──────────────┐            │       │
│  │  │   Actions    │  │    Auth      │            │       │
│  │  │ (External)   │  │ (Clerk JWT)  │            │       │
│  │  └──────────────┘  └──────────────┘            │       │
│  └───────────────────┬──────────────────────────────┘       │
└──────────────────────┼────────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────┐
│                    Data Layer                               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Families   │  │    Users     │  │    Babies    │   │
│  │  (Clerk Org) │  │  (Clerk)     │  │   (Convex)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Feeds     │  │   Diapers    │  │    Sleep     │   │
│  │  (Convex)    │  │   (Convex)   │  │   (Convex)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Growth     │  │  Milestones  │  │ Mood CheckIn │   │
│  │  (Convex)    │  │   (Convex)   │  │   (Convex)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### 3.2 Authentication Flow

```
User Action → Clerk UI → Clerk Backend → JWT Token
                                        ↓
                         Secure Storage (expo-secure-store)
                                        ↓
                         Convex Client (with JWT)
                                        ↓
                         Convex Auth Function (verify JWT)
                                        ↓
                         Data Access (based on user identity)
```

### 3.3 Real-Time Sync Flow

```
User A logs feed → React Query mutation → Convex mutation
                                                ↓
                                          Convex database
                                                ↓
                                    Real-time subscription
                                                ↓
                         User A's device (optimistic) ✅
                         User B's device (subscription) ✅
                         User C's device (subscription) ✅
```

---

## 4. Clerk Integration Architecture

### 4.1 Clerk Setup

```typescript
// lib/clerk.ts
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from './token-cache'

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  )
}

// lib/token-cache.ts
import * as SecureStore from 'expo-secure-store'
import { TokenCache } from '@clerk/clerk-expo/token-cache'

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token)
    } catch (err) {
      return
    }
  },
}
}
```

### 4.2 Clerk Organizations → Families Mapping

```typescript
// Clerk Organization Structure:
// Organization = Family
// Members = Family Members (Parents, Caregivers)
// Roles = Family Roles (primary, secondary, grandparent, etc.)

interface ClerkFamily {
  id: string              // Organization ID
  name?: string           // Family name
  memberships: Array<{
    userId: string
    role: string          // 'org:primary', 'org:secondary', etc.
  }>
  createdAt: number
  metadata: {
    premiumExpiry?: string
    dataRetentionYears?: string
  }
}
```

### 4.3 Convex External Auth Integration

```typescript
// convex/auth.config.ts
import { convexAuth } from '@convex-dev/auth/clerk'

export default convexAuth({
  providers: [ClerkProvider()],
})
```

```typescript
// convex/functions/queries.ts
import { query } from './_generated/server'
import { v } from 'convex/values'

export const getFamilyMembers = query({
  args: { familyId: v.id('families') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    // Clerk provides userId and organization membership
    const clerkUserId = identity.subject
    const family = await ctx.db.get(args.familyId)

    if (!family) {
      throw new Error('Family not found')
    }

    // Verify user is member of this family
    const membership = family.members.find(
      m => m.clerkUserId === clerkUserId
    )

    if (!membership) {
      throw new Error('Not authorized')
    }

    // Return family members
    return family.members
  },
})
```

---

## 5. UI Architecture (React Native Reusables)

### 5.1 Component Hierarchy

```
atoms/          (From react-native-reusables)
├── Button
├── Input
├── Slider
├── Text
├── Avatar
├── Badge
└── Card

molecules/
├── FeedCard
├── DiaperCard
├── SleepCard
├── MoodSlider
├── TagSelector
├── Header
└── TabBar

organisms/
├── FeedTracker
├── DiaperTracker
├── SleepTracker
├── MoodCheckIn
├── QuickJournal
├── ActivityFeed
└── CalendarView
```

### 5.2 Theming Setup (Tamagui)

```typescript
// config/tamagui.config.ts
import { createTamagui } from '@tamagui/core'

export const tamaguiConfig = createTamagui({
  tokens: {
    color: {
      primary: '#6366f1',      // Indigo-500
      primaryLight: '#818cf8',  // Indigo-400
      secondary: '#ec4899',     // Pink-500
      success: '#10b981',       // Green-500
      warning: '#f59e0b',       // Amber-500
      error: '#ef4444',        // Red-500
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        // ... grayscale
      }
    },
    space: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      '2xl': 32,
    },
  },
  themes: {
    light: {
      background: '#ffffff',
      color: '#0f172a',
    },
    dark: {
      background: '#0f172a',
      color: '#f8fafc',
    },
  },
})
```

### 5.3 Example Components

```typescript
// components/molecules/FeedCard.tsx
import { Card, CardContent, CardHeader } from 'rn-reusables'
import { MotiView } from 'moti'
import { Pressable } from 'react-native'

interface FeedCardProps {
  feed: Feed
  onPress?: () => void
}

export function FeedCard({ feed, onPress }: FeedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <Pressable onPress={onPress}>
        <Card className="mb-4">
          <CardHeader>
            <FeedTypeIcon type={feed.type} />
            <FeedTime time={feed.startTime} />
          </CardHeader>
          <CardContent>
            <FeedDetails feed={feed} />
            {feed.notes && <FeedNotes notes={feed.notes} />}
          </CardContent>
        </Card>
      </Pressable>
    </MotiView>
  )
}
```

---

## 6. Animation Architecture (Reanimated + Moti)

### 6.1 Animation Patterns

```typescript
// components/atoms/AnimatedButton.tsx
import { Button } from 'rn-reusables'
import { MotiView } from 'moti'
import { Pressable } from 'react-native-gesture-handler'

export function AnimatedButton({ children, onPress }: ButtonProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Pressable onPress={onPress}>
        <Button>{children}</Button>
      </Pressable>
    </MotiView>
  )
}

// Screen transitions
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      {children}
    </MotiView>
  )
}
```

### 6.2 Confetti Animation (Feed Completion)

```typescript
import { MotiView } from 'moti'

export function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 300,
    color: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
  }))

  return (
    <MotiView style={StyleSheet.absoluteFill}>
      {particles.map((p) => (
        <MotiView
          key={p.id}
          from={{
            opacity: 1,
            scale: 1,
            translateX: 0,
            translateY: 0,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            translateX: Math.random() * 200 - 100,
            translateY: Math.random() * 200 - 100,
          }}
          transition={{
            type: 'timing',
            duration: 1000 + Math.random() * 500,
            delay: Math.random() * 100,
          }}
          style={[
            styles.particle,
            { left: p.x, top: p.y, backgroundColor: p.color }
          ]}
        />
      ))}
    </MotiView>
  )
}
```

---

## 7. Data Visualization (Victory Native)

### 7.1 Growth Chart Implementation

```typescript
// components/organisms/GrowthChart.tsx
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native'
import { View } from 'react-native'

interface GrowthChartProps {
  data: Array<{ date: string; weight: number }>
  percentile?: 50 | 75 | 90 | 25 | 10
}

export function GrowthChart({ data, percentile = 50 }: GrowthChartProps) {
  return (
    <View style={styles.chartContainer}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={350}
        height={200}
        domainPadding={20}
      >
        <VictoryAxis dependentAxis />
        <VictoryAxis />
        <VictoryLine
          data={data}
          x="date"
          y="weight"
          style={{
            data: { stroke: '#6366f1', strokeWidth: 3 },
            parent: { border: '1px solid #ccc' },
          }}
        />
        <VictoryLine
          data={getWHOPercentile(percentile)}
          style={{
            data: { stroke: '#cbd5e1', strokeDasharray: '5,5' }
          }}
        />
      </VictoryChart>
    </View>
  )
}

function getWHOPercentile(percentile: number) {
  // Calculate WHO growth standards for given percentile
  // Returns array of { date, expectedWeight }
  // ...
}
```

### 7.2 Mood Trend Chart

```typescript
import { VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native'

export function MoodTrendChart({ data }: { data: MoodData[] }) {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={350}
      height={150}
    >
      <VictoryArea
        data={data}
        x="date"
        y="moodScore"
        style={{
          data: {
            fill: 'url(#gradient)',
            stroke: '#6366f1',
            strokeWidth: 2,
          },
        }}
        interpolation="natural"
      />
      <VictoryAxis />
    </VictoryChart>
  )
}
```

---

## 8. Encryption Architecture (Top-Tier Security)

### 8.1 Multi-Layer Encryption Strategy

```
Layer 1: Transmission (TLS 1.3)
  └─> Automatic (Clerk + Convex)

Layer 2: Storage at Rest (AES-256)
  └─> Automatic (Clerk + Convex)

Layer 3: Application-Level Encryption (Field-Level)
  └─> Custom: expo-crypto (AES-256-GCM)
```

### 8.2 Encrypted Fields

```typescript
// Fields to encrypt (client-side):
// - JournalEntry.content
// - JournalEntry.notes
// - MoodCheckIn.reflection
// - Feed.notes (optional, if user wants)
// - Milestone.notes (optional)
```

### 8.3 Encryption Implementation

**Important:** expo-secure-store has a 2048 byte (2KB) limit. Journal entries and long reflections cannot be stored directly. We use the **LargeSecureStore pattern**:

```typescript
// lib/encryption.ts
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ENCRYPTION_KEY = 'alora-encryption-key'

export class LargeSecureStore {
  /**
   * Get or generate encryption key (stored in SecureStore)
   * Key is limited to <2KB, perfect for this use case
   */
  private async getEncryptionKey(): Promise<string> {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY)

    if (!key) {
      // Generate new 256-bit encryption key
      key = await Crypto.getRandomBytesAsync(32)
      await SecureStore.setItemAsync(ENCRYPTION_KEY, key)
    }

    return key
  }

  /**
   * Encrypt data and store in AsyncStorage (unlimited capacity)
   * Returns JSON string with IV and encrypted data
   */
  async encrypt(plaintext: string): Promise<string> {
    const key = await this.getEncryptionKey()

    // Generate IV (12 bytes recommended for GCM)
    const iv = await Crypto.getRandomBytesAsync(12)

    // AES-256-GCM encryption
    const encrypted = await Crypto.encryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      plaintext,
      key,
      { iv }
    )

    // Return as JSON string (stores in AsyncStorage)
    return JSON.stringify({ iv, data: encrypted })
  }

  /**
   * Decrypt data from AsyncStorage
   */
  async decrypt(ciphertext: string): Promise<string> {
    const key = await this.getEncryptionKey()

    if (!key) {
      throw new Error('Encryption key not found')
    }

    const { iv, data } = JSON.parse(ciphertext)

    const decrypted = await Crypto.decryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      data,
      key,
      { iv }
    )

    return decrypted
  }

  /**
   * Store encrypted data with key in AsyncStorage
   */
  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(value)
    await AsyncStorage.setItem(key, encrypted)
  }

  /**
   * Get and decrypt data from AsyncStorage
   */
  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key)

    if (!encrypted) {
      return null
    }

    return await this.decrypt(encrypted)
  }

  /**
   * Remove item from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
  }

  /**
   * Clear encryption key on logout
   */
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ENCRYPTION_KEY)
  }
}

// Export singleton instance
export const secureStorage = new LargeSecureStore()
```

### 8.4 Usage in Components

```typescript
// hooks/useEncryptedJournal.ts
import { useMutation } from '@tanstack/react-query'
import { secureStorage } from '@/lib/encryption'

export function useCreateJournalEntry() {
  return useMutation({
    mutationFn: async (data: CreateJournalInput) => {
      // Encrypt sensitive content using LargeSecureStore
      await secureStorage.setItem(`journal-${Date.now()}`, data.content)
      await secureStorage.setItem(`journal-notes-${Date.now()}`, data.notes || '')

      // Send encrypted data to Convex
      return convex.mutation(api.journal.create, {
        ...data,
        content: await secureStorage.encrypt(data.content),
        notes: data.notes ? await secureStorage.encrypt(data.notes) : undefined,
      })
    },
  })
}

// Display decrypted content
export function useJournalEntry(entryId: string) {
  const { data: entry } = useQuery(...)

  const decryptedEntry = useQuery({
    queryKey: ['journal-decrypted', entryId],
    queryFn: async () => {
      if (!entry) return null

      // Decrypt using LargeSecureStore
      const decryptedContent = await secureStorage.decrypt(entry.content)
      const decryptedNotes = entry.notes ? await secureStorage.decrypt(entry.notes) : undefined

      return {
        ...entry,
        content: decryptedContent,
        notes: decryptedNotes,
      }
    },
  })

  return decryptedEntry
}
```

### 8.5 Security Best Practices

```typescript
// lib/security.ts
import { secureStorage } from './encryption'
import * as LocalAuthentication from 'expo-local-authentication'
import { AppState } from 'react-native'

export class SecurityManager {
  // Clear encryption key on logout
  static async clearOnLogout() {
    await secureStorage.clear()
  }

  // Verify user on sensitive operations
  static async verifyUser(): Promise<boolean> {
    // Option 1: Biometric auth (Face ID, Touch ID)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access journal',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    })

    return result.success

    // Option 2: Re-enter password (Clerk provides this)
    // await verifyPassword(input)
  }

  // Auto-lock after inactivity (5 minutes)
  static setupAutoLock() {
    let lastActiveTime = Date.now()

    const interval = setInterval(() => {
      if (Date.now() - lastActiveTime > 5 * 60 * 1000) { // 5 minutes
        this.lockApp()
      }
    }, 60000)

    // Update on user interaction
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        lastActiveTime = Date.now()
      }
    })
  }

  private static lockApp() {
    // Clear encryption key
    secureStorage.clear()

    // Navigate to lock screen
    // router.push('/lock')
  }

  // Verify encryption key exists on app launch
  static async verifyEncryptionKey(): Promise<boolean> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY)
      return key !== null
    } catch (error) {
      return false
    }
  }
}
```

---

## 9. State Management (React Query + Zustand)

### 9.1 Server State (React Query)

```typescript
// hooks/queries/useFeeds.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useFeeds(babyId: string, dateRange?: DateRange) {
  return useQuery({
    queryKey: ['feeds', babyId, dateRange],
    queryFn: () =>
      convex.query(api.feeds.list, {
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateFeed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeedInput) =>
      convex.mutation(api.feeds.create, data),
    onMutate: async (newFeed) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['feeds'] })

      const previousFeeds = queryClient.getQueryData(['feeds', newFeed.babyId])

      queryClient.setQueryData(['feeds', newFeed.babyId], (old: Feed[]) => [
        { ...newFeed, _id: 'temp-id', createdAt: Date.now() },
        ...(old || []),
      ])

      return { previousFeeds }
    },
    onError: (err, newFeed, context) => {
      // Rollback on error
      queryClient.setQueryData(['feeds', newFeed.babyId], context?.previousFeeds)
    },
    onSettled: () => {
      // Always refetch
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
    },
  })
}
```

### 9.2 Client State (Zustand)

```typescript
// stores/uiStore.ts
import { create } from 'zustand'

interface UIState {
  selectedBaby: string | null
  selectedFamily: string | null
  theme: 'light' | 'dark' | 'auto'
  isSidebarOpen: boolean

  actions: {
    setSelectedBaby: (id: string | null) => void
    setSelectedFamily: (id: string | null) => void
    setTheme: (theme: 'light' | 'dark' | 'auto') => void
    toggleSidebar: () => void
  }
}

export const useUIStore = create<UIState>((set) => ({
  selectedBaby: null,
  selectedFamily: null,
  theme: 'auto',
  isSidebarOpen: false,

  actions: {
    setSelectedBaby: (id) => set({ selectedBaby: id }),
    setSelectedFamily: (id) => set({ selectedFamily: id }),
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  },
}))

// Usage
export function useSelectedBaby() {
  return useUIStore((state) => state.selectedBaby)
}

export function useUIActions() {
  return useUIStore((state) => state.actions)
}
```

---

## 10. Offline Support Strategy

### 10.1 Offline Detection

```typescript
// hooks/useOffline.ts
import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react-native'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingOperations, setPendingOperations] = useState(0)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false)
    })

    // Monitor Convex sync status
    const syncUnsubscribe = convex.onSyncStatus((status) => {
      setPendingOperations(status.pendingOperations)
    })

    return () => {
      unsubscribe()
      syncUnsubscribe()
    }
  }, [])

  return { isOnline, pendingOperations, isSyncing: pendingOperations > 0 }
}
```

### 10.2 Sync Status Indicator

```typescript
// components/atoms/SyncStatus.tsx
import { View, Text } from 'react-native'
import { useOffline } from '@/hooks/useOffline'
import { MotiView } from 'moti'

export function SyncStatus() {
  const { isOnline, pendingOperations } = useOffline()

  return (
    <View style={styles.container}>
      <MotiView
        animate={{
          backgroundColor: isOnline && pendingOperations === 0 ? '#10b981' : '#f59e0b',
          scale: pendingOperations > 0 ? [1, 1.2, 1] : 1,
        }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.dot}
      />
      {pendingOperations > 0 && (
        <Text style={styles.statusText}>Syncing... ({pendingOperations})</Text>
      )}
      {!isOnline && <Text style={styles.statusText}>Offline</Text>}
    </View>
  )
}
```

---

## 11. Project Structure

```
alora/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── trackers.tsx
│   │   ├── wellness.tsx
│   │   ├── calendar.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── components/
│   ├── atoms/                     # From react-native-reusables
│   │   └── index.ts
│   ├── molecules/
│   │   ├── FeedCard.tsx
│   │   ├── DiaperCard.tsx
│   │   ├── SleepCard.tsx
│   │   ├── MoodSlider.tsx
│   │   ├── TagSelector.tsx
│   │   └── index.ts
│   ├── organisms/
│   │   ├── FeedTracker.tsx
│   │   ├── DiaperTracker.tsx
│   │   ├── SleepTracker.tsx
│   │   ├── GrowthTracker.tsx
│   │   ├── MilestoneTracker.tsx
│   │   ├── MoodCheckIn.tsx
│   │   ├── QuickJournal.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── index.ts
│   └── layout/
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── index.ts
├── hooks/
│   ├── queries/
│   │   ├── useFeeds.ts
│   │   ├── useDiapers.ts
│   │   ├── useSleep.ts
│   │   ├── useMoodCheckIns.ts
│   │   └── index.ts
│   ├── mutations/
│   │   ├── useCreateFeed.ts
│   │   ├── useCreateMoodCheckIn.ts
│   │   └── index.ts
│   ├── useOffline.ts
│   ├── usePermissions.ts
│   └── index.ts
├── stores/
│   ├── uiStore.ts
│   ├── authStore.ts
│   └── index.ts
├── lib/
│   ├── clerk.ts
│   ├── token-cache.ts
│   ├── convex.ts
│   ├── encryption.ts           # LargeSecureStore implementation
│   ├── security.ts             # Biometric auth, auto-lock
│   └── index.ts
├── config/
│   ├── tamagui.config.ts
│   ├── clerk.config.ts
│   └── index.ts
├── types/
│   ├── convex.ts
│   ├── app.ts
│   └── index.ts
├── convex/
│   ├── schema.ts
│   ├── auth.config.ts
│   └── functions/
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
│   ├── hooks/
│   └── e2e/
├── docs/
├── app.json
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 12. LargeSecureStore Pattern Explanation

### Why This Pattern Is Needed

**expo-secure-store Limitation:**
- Maximum storage: **2048 bytes (2KB)**
- Cannot store journal entries, notes, or long reflections
- Purpose: Store small secrets (API keys, tokens)

**Solution - LargeSecureStore:**
1. **Encryption key** → Stored in expo-secure-store (secure keychain, <2KB)
2. **Encrypted data** → Stored in AsyncStorage (unlimited capacity)

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│              Storage Strategy                       │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  SecureStore    │  │  AsyncStorage   │        │
│  │  (Keychain)     │  │  (Large Data)  │        │
│  │  Encryption Key │  │  Encrypted     │        │
│  │  (~32 bytes)    │  │  Journal,     │        │
│  │                  │  │  Notes, etc.   │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                      │
│  When encrypting:                                    │
│  1. Get key from SecureStore                      │
│  2. Encrypt data with key                           │
│  3. Store in AsyncStorage                           │
│                                                     │
│  When decrypting:                                    │
│  1. Get key from SecureStore                      │
│  2. Get encrypted data from AsyncStorage              │
│  3. Decrypt with key                              │
│                                                     │
└─────────────────────────────────────────────────────────┘
```

### Security Benefits

1. **Encryption key protected** - Even if AsyncStorage is compromised, data is encrypted
2. **No password storage** - Key derived from Clerk auth, never user password
3. **Secure keychain access** - Key requires device unlock on iOS/Android
4. **Automatic key rotation** - Generate new key per session or user lifecycle

### Performance Notes

- **Encryption**: ~50ms for typical journal entry (500 chars)
- **Decryption**: ~30ms for same entry
- **AsyncStorage writes**: Fast, non-blocking
- **Overall impact**: Negligible for user experience

---

 ### 12.6 Key Rotation Strategy
 
 - Goals: Minimize risk from long-lived keys; rotate keys on defined triggers (session-bound, time-based, or manual rotation).
 - Approach:
   - Keep the active encryption key in expo-secure-store under a versioned key id (e.g., "alora-key-v1").
   - When rotation is triggered, generate a new 256-bit key and store it as a new version (e.g., "alora-key-v2") in SecureStore.
   - Re-encrypt existing AsyncStorage payloads (LargeSecureStore data) with the new key in a background migration task.
   - Maintain a grace period where both old and new keys are accepted for decryption, then purge older keys after verification.
 - Migration details:
   - Data flagged for rotation will be migrated incrementally; show user-visible progress if needed (e.g., during a login or app startup).
   - If decryption with the old key fails for an item, log and skip that item temporarily; require a manual recovery flow.
 - Key lifecycle policy:
   - Rotate keys at a defined cadence or on user-triggered events; keep a minimum of two versions during a grace window.
   - Purge old keys after a successful migration window.
 - Testing:
   - Unit tests for rotate-encrypt/decrypt across both keys.
   - Integration tests simulating rotation during normal usage.
 
 ### 12.7 Data Migration Plan
 
 - Objective: Safely re-encrypt existing encrypted data with the new rotation key.
 - Steps:
   1) Enumerate AsyncStorage items with encrypted payloads.
   2) For each item, decrypt using the old key, then re-encrypt with the new key.
   3) Write the new ciphertext back to storage; update any metadata/versioning.
   4) Validate a read-back round-trip for a sample of items.
   5) On success, purge references to the old key after the grace period.
 - Backward compatibility:
   - If an item cannot be decrypted, log and skip; provide a manual recovery path.
 - Testing:
   - End-to-end migration tests with synthetic data; simulate partial failures and ensure graceful rollback.
 
 ### 12.8 Backups, Compliance & Portability
 
 - Backups:
   - Ensure encrypted payloads stored in AsyncStorage are included in device backups and protected by the key-management policy.
 - Portability:
   - Plan for moving data between devices (secure key transfer method, device-binding considerations).
 - Compliance:
   - Document data privacy alignment; maintain rotation audit logs.
 - Testing:
   - Backup/restore tests with encrypted data to ensure decryptability after restore.
 
 ### 12.9 Security Validation & Testing
 
 - Security tests:
   - Unit tests for all crypto helpers; integration tests covering end-to-end encryption, rotation, and decryption flows.
 - Threat modeling:
   - Update the threat model to include rotation flows, key leakage, and backup exposure.
 - Runbooks:
   - Rotation, migration, incident response, and rollback procedures.
 
 ## 13. Next Steps (Expanded)
 
 13.1 Kickoff & Foundations
 13.2 Core Auth & Backend Setup
 13.3 LargeSecureStore Implementation
 13.4 UI Component Library Skeleton
 13.5 Real-time Data & Offline
 13.6 First Tracker MVP
 13.7 Testing Strategy
 13.8 CI/CD & Release
 13.9 Observability & Reliability
 13.10 Documentation & Runbooks
 13.11 Security Review & Sign-off
 13.12 Risks & Mitigations
 
 ### Risks & Mitigations
 
 - Data risk during rotation: mitigate via staged migrations with progress reporting and user notifications.
 - Key management risk: mitigate via device-binding, re-auth triggers, and audit logging.
 - Implementation risk: mitigate via feature flags, incremental rollout, and thorough testing.

1. Initialize Expo project with Convex
2. Set up Clerk authentication (with Organizations)
3. Install dependencies:
   - react-native-reusables + tamagui
   - @react-native-async-storage/async-storage (for LargeSecureStore)
   - expo-crypto
   - expo-local-authentication (biometrics)
4. Implement LargeSecureStore encryption pattern
5. Create component library structure
6. Implement authentication flow
7. Build first tracker (Feed)
8. Set up testing infrastructure
9. Configure CI/CD pipeline

---

**Document Status:** Draft - Pending Review

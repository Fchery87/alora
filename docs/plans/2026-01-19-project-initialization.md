# Alora Project Initialization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize a production-ready Expo project with Convex backend, Clerk authentication, React Native Reusables UI, and LargeSecureStore encryption.

**Architecture:**
- Frontend: Expo SDK 50 with React Native 0.73+, file-based routing via Expo Router
- Backend: Convex for real-time database, subscriptions, and offline queue
- Auth: Clerk with Organizations for family management, external auth integration with Convex
- UI: React Native Reusables (shadcn-like) built on Tamagui for styling
- State: React Query (TanStack Query) for server state, Zustand for client state
- Security: LargeSecureStore pattern (expo-crypto + expo-secure-store + AsyncStorage)

**Tech Stack:**
- Runtime: Bun 1.0+
- Framework: React Native 0.73+, Expo SDK 50+, TypeScript 5.0+
- Auth: @clerk/clerk-expo, @clerk/expo-passkeys (optional)
- Backend: convex, @convex-dev/auth/clerk
- UI: react-native-reusables, @tamagui/core, @tamagui/config
- Animations: react-native-reanimated, moti
- Charts: victory-native
- Encryption: expo-crypto, expo-secure-store, @react-native-async-storage/async-storage
- State: @tanstack/react-query, zustand
- Navigation: expo-router
- Biometrics: expo-local-authentication
- Icons: @expo/vector-icons
- Gestures: react-native-gesture-handler
- Network: @react-native-community/netinfo

---

## Prerequisites

Before starting this plan, ensure you have:
1. Node.js 20+ installed
2. Bun 1.0+ installed
3. Expo CLI installed globally: `bun add -g expo-cli`
4. GitHub repository initialized
5. Expo account created
6. Clerk account created (free tier)
7. Convex account created (free tier)

---

## Task 1: Initialize Expo Project

**Files:**
- Create: `app.json`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Create project directory structure**

Run:
```bash
cd /home/nochaserz/Documents/Coding\ Projects/alora
mkdir -p docs/plans
```

**Step 2: Create app.json (Expo configuration)**

```json
{
  "expo": {
    "name": "Alora",
    "slug": "alora",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "alora",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.alora.app",
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.alora.app",
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": false
      }
    },
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

**Step 3: Create package.json with all dependencies**

```json
{
  "name": "alora",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clerk/clerk-expo": "^1.0.0",
    "@expo/vector-icons": "^14.0.0",
    "@react-native-async-storage/async-storage": "^1.23.0",
    "@react-native-community/netinfo": "^11.3.0",
    "@tanstack/react-query": "^5.0.0",
    "convex": "^1.16.0",
    "expo": "~50.0.0",
    "expo-application": "~5.8.0",
    "expo-blur": "~12.9.0",
    "expo-constants": "~15.4.0",
    "expo-crypto": "~12.8.0",
    "expo-device": "~5.9.0",
    "expo-font": "~11.10.0",
    "expo-image": "~1.12.0",
    "expo-linking": "~6.2.0",
    "expo-local-authentication": "~13.8.0",
    "expo-router": "~3.5.0",
    "expo-secure-store": "~12.8.0",
    "expo-splash-screen": "~0.26.0",
    "expo-status-bar": "~1.11.0",
    "moti": "^0.28.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-gesture-handler": "~2.16.0",
    "react-native-reanimated": "~3.8.0",
    "react-native-reusables": "^1.0.0",
    "react-native-safe-area-context": "4.8.0",
    "react-native-screens": "~3.31.0",
    "victory-native": "^36.9.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@clerk/expo-passkeys": "^1.0.0",
    "@convex-dev/auth/clerk": "^1.0.0",
    "@tamagui/config": "^1.100.0",
    "@tamagui/core": "^1.100.0",
    "@testing-library/react-native": "^12.5.0",
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^8.56.0",
    "eslint-config-expo": "^7.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-native": "^4.1.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "bun": ">=1.0.0"
  }
}
```

**Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "resolveJsonModule": true,
    "strict": true,
    "target": "ES2020",
    "types": ["react-native", "expo-router"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/lib/*": ["./lib/*"],
      "@/stores/*": ["./stores/*"],
      "@/config/*": ["./config/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "**/*.config.js",
    "**/*.config.ts"
  ]
}
```

**Step 5: Create .gitignore**

```bash
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Expo
.expo/
.expo-shared/
dist/
web-build/

# Environment
.env
.env.local
.env.*.local

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
```

**Step 6: Create README.md**

```markdown
# Alora

A comprehensive parenting companion app for new parents, combining baby tracking, mental health support, and family synchronization.

## Tech Stack

- **Frontend:** React Native 0.73+, Expo SDK 50+
- **Auth:** Clerk with Organizations
- **Backend:** Convex (real-time database)
- **UI:** React Native Reusables (built on Tamagui)
- **State:** React Query + Zustand
- **Security:** AES-256-GCM encryption (LargeSecureStore pattern)

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run start

# Run on iOS
bun run ios

# Run on Android
bun run android
```

## Environment Variables

Create a `.env` file:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CONVEX_DEPLOYMENT=https://xxx.convex.cloud
```

## Documentation

- [Technical Design](./docs/plans/2026-01-19-technical-design.md)
- [Product Requirements](./docs/PRD.md)
- [Architecture](./docs/Architecture.md)

## License

Copyright © 2026 Alora
```

**Step 7: Install dependencies**

Run:
```bash
cd /home/nochaserz/Documents/Coding\ Projects/alora
bun install
```

Expected: All packages installed successfully

**Step 8: Commit**

Run:
```bash
git add app.json package.json tsconfig.json .gitignore README.md
git commit -m "chore: initialize Expo project with dependencies"
```

---

## Task 2: Initialize Convex Backend

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/_generated/api.d.ts` (auto-generated later)
- Create: `convex/auth.config.ts`

**Step 1: Create convex directory and schema**

Run:
```bash
mkdir -p convex
```

**Step 2: Create convex/schema.ts**

```typescript
import { defineSchema, defineTable } from "convex/server";

// Schema will be built incrementally
// Start with basic users and families

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_clerk_user_id")
    .index("by_email"),

  families: defineTable({
    clerkOrganizationId: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    settings: v.optional(
      v.object({
        premiumPlan: v.union(v.literal("free"), v.literal("premium")),
        premiumExpiry: v.optional(v.number()),
      })
    ),
  })
    .index("by_clerk_org_id"),

  babies: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
    birthDate: v.number(),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    photoUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_family", ["clerkOrganizationId"])
    .index("by_family_and_birth", ["clerkOrganizationId", "birthDate"]),
});
```

**Step 3: Create convex/auth.config.ts**

```typescript
import { convexAuth } from "@convex-dev/auth/clerk";

export default convexAuth({
  providers: [ClerkProvider()],
});
```

**Step 4: Initialize Convex deployment**

Run:
```bash
npx convex dev
```

Expected: Convex CLI prompts for project creation, creates deployment URL

**Step 5: Create .env file**

Create `.env`:
```bash
# Convex
CONVEX_DEPLOYMENT=https://xxx.convex.cloud

# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
```

**Step 6: Commit**

Run:
```bash
git add convex/ .env
git commit -m "feat: initialize Convex schema and auth config"
```

---

## Task 3: Set Up Clerk Authentication

**Files:**
- Create: `lib/clerk.ts`
- Create: `lib/token-cache.ts`
- Create: `app/_layout.tsx`

**Step 1: Create lib directory**

Run:
```bash
mkdir -p lib
```

**Step 2: Create lib/token-cache.ts**

```typescript
import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo/token-cache";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (err) {
      return;
    }
  },
};
```

**Step 3: Create lib/clerk.ts**

```typescript
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./token-cache";
import Constants from "expo-constants";

const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey as string;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
    >
      {children}
    </ClerkProvider>
  );
}
```

**Step 4: Update app.json with Clerk key**

Edit `app.json`:
```json
{
  "expo": {
    "extra": {
      "clerkPublishableKey": "pk_test_xxxx"
    }
  }
}
```

**Step 5: Create app/_layout.tsx**

```typescript
import { ClerkProviderWrapper } from "@/lib/clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent native splash screen from autohiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProviderWrapper>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProviderWrapper>
  );
}
```

**Step 6: Commit**

Run:
```bash
git add lib/ app/_layout.tsx app.json
git commit -m "feat: set up Clerk authentication provider"
```

---

## Task 4: Implement LargeSecureStore Encryption

**Files:**
- Create: `lib/encryption.ts`
- Create: `lib/security.ts`

**Step 1: Create lib/encryption.ts**

```typescript
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENCRYPTION_KEY = "alora-encryption-key";

export class LargeSecureStore {
  /**
   * Get or generate encryption key (stored in SecureStore)
   * Key is limited to <2KB, perfect for this use case
   */
  private async getEncryptionKey(): Promise<string> {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY);

    if (!key) {
      // Generate new 256-bit encryption key
      key = await Crypto.getRandomBytesAsync(32);
      await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
    }

    return key;
  }

  /**
   * Encrypt data and return JSON string with IV and encrypted data
   */
  async encrypt(plaintext: string): Promise<string> {
    const key = await this.getEncryptionKey();

    // Generate IV (12 bytes recommended for GCM)
    const iv = await Crypto.getRandomBytesAsync(12);

    // AES-256-GCM encryption
    const encrypted = await Crypto.encryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      plaintext,
      key,
      { iv }
    );

    // Return as JSON string (stores in AsyncStorage)
    return JSON.stringify({ iv, data: encrypted });
  }

  /**
   * Decrypt data from JSON string
   */
  async decrypt(ciphertext: string): Promise<string> {
    const key = await this.getEncryptionKey();

    if (!key) {
      throw new Error("Encryption key not found");
    }

    const { iv, data } = JSON.parse(ciphertext);

    const decrypted = await Crypto.decryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      data,
      key,
      { iv }
    );

    return decrypted;
  }

  /**
   * Store encrypted data with key in AsyncStorage
   */
  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(value);
    await AsyncStorage.setItem(key, encrypted);
  }

  /**
   * Get and decrypt data from AsyncStorage
   */
  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key);

    if (!encrypted) {
      return null;
    }

    return await this.decrypt(encrypted);
  }

  /**
   * Remove item from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  /**
   * Clear encryption key on logout
   */
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ENCRYPTION_KEY);
  }
}

// Export singleton instance
export const secureStorage = new LargeSecureStore();
```

**Step 2: Create lib/security.ts**

```typescript
import { secureStorage } from "./encryption";
import * as LocalAuthentication from "expo-local-authentication";
import { AppState, AppStateStatus } from "react-native";

const ENCRYPTION_KEY = "alora-encryption-key";

export class SecurityManager {
  private static lockTimer: NodeJS.Timeout | null = null;

  /**
   * Clear encryption key on logout
   */
  static async clearOnLogout(): Promise<void> {
    await secureStorage.clear();
  }

  /**
   * Verify user on sensitive operations
   */
  static async verifyUser(): Promise<boolean> {
    // Option 1: Biometric auth (Face ID, Touch ID)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access journal",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    return result.success;
  }

  /**
   * Auto-lock after inactivity (5 minutes)
   */
  static setupAutoLock(): void {
    let lastActiveTime = Date.now();

    // Clear any existing timer
    if (this.lockTimer) {
      clearInterval(this.lockTimer);
    }

    this.lockTimer = setInterval(() => {
      if (Date.now() - lastActiveTime > 5 * 60 * 1000) {
        // 5 minutes
        this.lockApp();
      }
    }, 60000);

    // Update on user interaction
    AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        lastActiveTime = Date.now();
      }
    });
  }

  /**
   * Lock the app (clear keys)
   */
  private static lockApp(): void {
    secureStorage.clear();

    // TODO: Navigate to lock screen
    // router.push("/lock");
  }

  /**
   * Verify encryption key exists on app launch
   */
  static async verifyEncryptionKey(): Promise<boolean> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
      return key !== null;
    } catch (error) {
      return false;
    }
  }
}
```

**Step 3: Commit**

Run:
```bash
git add lib/
git commit -m "feat: implement LargeSecureStore encryption and security manager"
```

---

## Task 5: Set Up Tamagui and React Native Reusables

**Files:**
- Create: `config/tamagui.config.ts`
- Create: `babel.config.js`
- Modify: `app/_layout.tsx`

**Step 1: Create config directory**

Run:
```bash
mkdir -p config
```

**Step 2: Create config/tamagui.config.ts**

```typescript
import { createTamagui } from "@tamagui/core";

export const tamaguiConfig = createTamagui({
  tokens: {
    color: {
      primary: "#6366f1", // Indigo-500
      primaryLight: "#818cf8", // Indigo-400
      primaryDark: "#4f46e5", // Indigo-600
      secondary: "#ec4899", // Pink-500
      secondaryLight: "#f472b6", // Pink-400
      success: "#10b981", // Green-500
      warning: "#f59e0b", // Amber-500
      error: "#ef4444", // Red-500
      neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
    space: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      8: 32,
      10: 40,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      "2xl": 32,
      "3xl": 40,
      "4xl": 48,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
    shadow: {
      sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    },
  },
  themes: {
    light: {
      background: "#ffffff",
      color: "#0f172a",
      border: "#e2e8f0",
    },
    dark: {
      background: "#0f172a",
      color: "#f8fafc",
      border: "#334155",
    },
  },
  media: {
    sm: "(max-width: 640px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
    xl: "(max-width: 1280px)",
  },
});

// Type for Tamagui Provider
export type { tamaguiConfig };
```

**Step 3: Create babel.config.js**

```javascript
module.exports = function (api) {
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["react-native-reusables"],
          config: "./config/tamagui.config.ts",
        },
      ],
    ],
  };
};
```

**Step 4: Update app/_layout.tsx to include Tamagui**

```typescript
import { ClerkProviderWrapper } from "@/lib/clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TamaguiProvider, createTamagui } from "tamagui";
import { tamaguiConfig } from "@/config/tamagui.config";

// Prevent native splash screen from autohiding
SplashScreen.preventAutoHideAsync();

// Create Tamagui instance
const tamagui = createTamagui(tamaguiConfig);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProviderWrapper>
      <TamaguiProvider config={tamagui}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </TamaguiProvider>
    </ClerkProviderWrapper>
  );
}
```

**Step 5: Commit**

Run:
```bash
git add config/ babel.config.js app/_layout.tsx
git commit -m "feat: set up Tamagui and React Native Reusables"
```

---

## Task 6: Set Up Zustand Store

**Files:**
- Create: `stores/uiStore.ts`
- Create: `stores/index.ts`

**Step 1: Create stores directory**

Run:
```bash
mkdir -p stores
```

**Step 2: Create stores/uiStore.ts**

```typescript
import { create } from "zustand";

interface UIState {
  selectedBaby: string | null;
  selectedFamily: string | null;
  theme: "light" | "dark" | "auto";
  isSidebarOpen: boolean;
  actions: {
    setSelectedBaby: (id: string | null) => void;
    setSelectedFamily: (id: string | null) => void;
    setTheme: (theme: "light" | "dark" | "auto") => void;
    toggleSidebar: () => void;
  };
}

export const useUIStore = create<UIState>((set) => ({
  selectedBaby: null,
  selectedFamily: null,
  theme: "auto",
  isSidebarOpen: false,

  actions: {
    setSelectedBaby: (id) => set({ selectedBaby: id }),
    setSelectedFamily: (id) => set({ selectedFamily: id }),
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  },
}));

// Convenience hooks
export function useSelectedBaby() {
  return useUIStore((state) => state.selectedBaby);
}

export function useSelectedFamily() {
  return useUIStore((state) => state.selectedFamily);
}

export function useTheme() {
  return useUIStore((state) => state.theme);
}

export function useUIActions() {
  return useUIStore((state) => state.actions);
}
```

**Step 3: Create stores/index.ts**

```typescript
export * from "./uiStore";
```

**Step 4: Commit**

Run:
```bash
git add stores/
git commit -m "feat: set up Zustand UI store"
```

---

## Task 7: Create Basic App Structure and Screens

**Files:**
- Create: `app/(auth)/login.tsx`
- Create: `app/(auth)/register.tsx`
- Create: `app/(auth)/onboarding.tsx`
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/dashboard.tsx`
- Create: `app/(tabs)/trackers.tsx`
- Create: `app/(tabs)/wellness.tsx`
- Create: `app/(tabs)/calendar.tsx`
- Create: `app/(tabs)/profile.tsx`
- Create: `app/index.tsx`

**Step 1: Create auth directory and layout**

Run:
```bash
mkdir -p "app/(auth)"
```

**Step 2: Create app/(auth)/_layout.tsx**

```typescript
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    />
  );
}
```

**Step 3: Create app/(auth)/login.tsx**

```typescript
import { SignIn } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SignIn />
    </View>
  );
}
```

**Step 4: Create app/(auth)/register.tsx**

```typescript
import { SignUp } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SignUp />
    </View>
  );
}
```

**Step 5: Create app/(auth)/onboarding.tsx**

```typescript
import { Text, View } from "react-native";
import { MotiView } from "moti";

export default function OnboardingScreen() {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 600 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>
        Welcome to Alora
      </Text>
      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 32 }}>
        Your parenting companion
      </Text>
      {/* TODO: Add onboarding steps */}
    </MotiView>
  );
}
```

**Step 6: Create tabs directory and layout**

Run:
```bash
mkdir -p "app/(tabs)"
```

**Step 7: Create app/(tabs)/_layout.tsx**

```typescript
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trackers"
        options={{
          title: "Trackers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: "Wellness",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

**Step 8: Create placeholder tab screens**

Create `app/(tabs)/dashboard.tsx`:
```typescript
import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dashboard - Coming Soon</Text>
    </View>
  );
}
```

Create `app/(tabs)/trackers.tsx`:
```typescript
import { View, Text } from "react-native";

export default function TrackersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trackers - Coming Soon</Text>
    </View>
  );
}
```

Create `app/(tabs)/wellness.tsx`:
```typescript
import { View, Text } from "react-native";

export default function WellnessScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Wellness - Coming Soon</Text>
    </View>
  );
}
```

Create `app/(tabs)/calendar.tsx`:
```typescript
import { View, Text } from "react-native";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Calendar - Coming Soon</Text>
    </View>
  );
}
```

Create `app/(tabs)/profile.tsx`:
```typescript
import { View, Text, UserButton } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile</Text>
      <UserButton />
    </View>
  );
}
```

**Step 9: Create app/index.tsx (landing)**

```typescript
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function IndexScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
```

**Step 10: Commit**

Run:
```bash
git add app/
git commit -m "feat: create basic app structure with auth and tab screens"
```

---

## Task 8: Set Up Convex Client and React Query

**Files:**
- Create: `lib/convex.ts`
- Create: `hooks/useOffline.ts`

**Step 1: Create lib/convex.ts**

```typescript
import { ConvexReactClient } from "convex/react";
import Constants from "expo-constants";

const convexUrl = Constants.expoConfig?.extra?.convexDeployment as string;

if (!convexUrl) {
  throw new Error("Missing Convex Deployment URL");
}

export const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: true,
});

export type ConvexFunction = typeof import("./convex/_generated/api").api;
```

**Step 2: Update app/_layout.tsx to include Convex provider**

```typescript
import { ClerkProviderWrapper } from "@/lib/clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TamaguiProvider, createTamagui } from "tamagui";
import { tamaguiConfig } from "@/config/tamagui.config";
import { convex } from "@/lib/convex";

// Prevent native splash screen from autohiding
SplashScreen.preventAutoHideAsync();

// Create Tamagui instance
const tamagui = createTamagui(tamaguiConfig);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProviderWrapper>
      <ConvexProvider client={convex}>
        <TamaguiProvider config={tamagui}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </TamaguiProvider>
      </ConvexProvider>
    </ClerkProviderWrapper>
  );
}
```

**Step 3: Create hooks directory**

Run:
```bash
mkdir -p hooks
```

**Step 4: Create hooks/useOffline.ts**

```typescript
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOperations, setPendingOperations] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline, pendingOperations, isSyncing: pendingOperations > 0 };
}
```

**Step 5: Commit**

Run:
```bash
git add lib/convex.ts app/_layout.tsx hooks/
git commit -m "feat: set up Convex client and React Query integration"
```

---

## Task 9: Set Up Testing Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `.eslintrc.js`
- Create: `.prettierrc`
- Create: `__tests__/setup.ts`
- Create: `__tests__/components/placeholder.test.tsx`

**Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@": "./",
    },
  },
});
```

**Step 2: Create .eslintrc.js**

```javascript
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["react-hooks", "react-native"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-native/no-inline-styles": "warn",
  },
  ignorePatterns: ["dist", ".expo", "node_modules"],
};
```

**Step 3: Create .prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

**Step 4: Create __tests__ directory**

Run:
```bash
mkdir -p __tests__/components
```

**Step 5: Create __tests__/setup.ts**

```typescript
import "@testing-library/jest-dom/vitest";
```

**Step 6: Create __tests__/components/placeholder.test.tsx**

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react-native";

describe("Placeholder", () => {
  it("should render correctly", () => {
    // TODO: Add actual tests
    expect(true).toBe(true);
  });
});
```

**Step 7: Commit**

Run:
```bash
git add vitest.config.ts .eslintrc.js .prettierrc __tests__/
git commit -m "test: set up testing infrastructure"
```

---

## Task 10: Set Up Husky and Lint-Staged

**Files:**
- Create: `.husky/pre-commit`
- Create: `.lintstagedrc.json`

**Step 1: Initialize Husky**

Run:
```bash
bun add -D husky lint-staged
bunx husky init
```

**Step 2: Create .lintstagedrc.json**

```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run --passWithNoTests"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

**Step 3: Update .husky/pre-commit**

Run:
```bash
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx lint-staged
EOF

chmod +x .husky/pre-commit
```

**Step 4: Commit**

Run:
```bash
git add .husky .lintstagedrc.json package.json
git commit -m "chore: set up Husky pre-commit hooks with lint-staged"
```

---

## Task 11: Set Up GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/build-ios.yml`
- Create: `.github/workflows/build-android.yml`

**Step 1: Create .github/workflows directory**

Run:
```bash
mkdir -p .github/workflows
```

**Step 2: Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install
      - name: Run linter
        run: bun run lint
      - name: Run type check
        run: bun run typecheck
      - name: Run tests
        run: bun run test
```

**Step 3: Create .github/workflows/build-ios.yml**

```yaml
name: Build iOS

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build iOS
        run: eas build --platform ios --profile production
```

**Step 4: Create .github/workflows/build-android.yml**

```yaml
name: Build Android

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build Android
        run: eas build --platform android --profile production
```

**Step 5: Commit**

Run:
```bash
git add .github/
git commit -m "ci: set up GitHub Actions for testing and building"
```

---

## Task 12: Verify and Test Setup

**Files:**
- Test: All previous tasks

**Step 1: Install all dependencies**

Run:
```bash
bun install
```

Expected: All packages installed successfully

**Step 2: Start development server**

Run:
```bash
bun run start
```

Expected: Expo dev server starts at http://localhost:8081

**Step 3: Run type check**

Run:
```bash
bun run typecheck
```

Expected: No TypeScript errors

**Step 4: Run linter**

Run:
```bash
bun run lint
```

Expected: No linting errors

**Step 5: Run tests**

Run:
```bash
bun run test
```

Expected: Tests pass

**Step 6: Commit final setup**

Run:
```bash
git add .
git commit -m "chore: complete project initialization - ready for feature development"
```

---

## Next Steps After Initialization

Once this plan is complete:

1. **Create worktree** for first feature (Feed Tracker)
2. **Implement Feed Tracker** following user stories from PRD
3. **Add more Convex functions** for feeds, diapers, sleep, etc.
4. **Build out components** using React Native Reusables
5. **Implement mood check-in** and journal features
6. **Set up real-time subscriptions** for family sync

---

## Notes

- All environment variables are stored in `.env` (add to `.gitignore`)
- Convex schema will be expanded incrementally as features are added
- Clerk Organizations will be used for family management
- LargeSecureStore handles unlimited data via AsyncStorage with encryption key in SecureStore
- Biometric authentication is optional for sensitive features
- CI/CD will run on every push to main/develop branches

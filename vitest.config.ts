import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./__tests__/setup.tsx"],
    include: ["__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.worktrees/**",
      "**/__tests__/e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "__tests__/setup.ts",
        "**/*.d.ts",
        "**/.worktrees/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "@/components": resolve(__dirname, "./components"),
      "@/hooks": resolve(__dirname, "./hooks"),
      "@/lib": resolve(__dirname, "./lib"),
      "@/stores": resolve(__dirname, "./stores"),
      "@/config": resolve(__dirname, "./config"),
      "@/types": resolve(__dirname, "./types"),
      "@/convex": resolve(__dirname, "./convex"),
      "expo-secure-store": resolve(
        __dirname,
        "./__tests__/mocks/expo-secure-store.ts"
      ),
      "expo-crypto": resolve(__dirname, "./__tests__/mocks/expo-crypto.ts"),
      "expo-constants": resolve(
        __dirname,
        "./__tests__/mocks/expo-constants.ts"
      ),
      "@react-native-async-storage/async-storage": resolve(
        __dirname,
        "./__tests__/mocks/async-storage.ts"
      ),
      "react-native": resolve(__dirname, "./__tests__/mocks/react-native"),
      "@clerk/clerk-expo": resolve(
        __dirname,
        "./__tests__/mocks/clerk-expo.ts"
      ),
      "@expo/vector-icons": resolve(
        __dirname,
        "./__tests__/mocks/expo-vector-icons.ts"
      ),
      "victory-native": resolve(
        __dirname,
        "./__tests__/mocks/victory-native.ts"
      ),
      "@testing-library/react-native": resolve(
        __dirname,
        "./__tests__/mocks/testing-library-react-native.ts"
      ),
      "react-native-svg": resolve(
        __dirname,
        "./__tests__/mocks/react-native-svg.ts"
      ),
      "react-native-reanimated": resolve(
        __dirname,
        "./__tests__/mocks/react-native-reanimated.ts"
      ),
      moti: resolve(__dirname, "./__tests__/mocks/moti.ts"),
    },
  },
});

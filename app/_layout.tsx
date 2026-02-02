// Load Reanimated web shim before any animations
import "@/lib/reanimated-web-shim";
import "../global.css";

import { Stack } from "expo-router";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ClerkProviderWrapper } from "@/lib/clerk";
import { ConvexProviderWrapper } from "@/components/providers/ConvexProviderWrapper";
import { ToastProvider } from "@/components/atoms/Toast";
import { QueryClientProviderWrapper } from "@/components/providers/QueryClientProviderWrapper";
import { initSentry } from "@/lib/sentry";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

// Initialize Sentry before app starts
initSentry();

SplashScreen.preventAutoHideAsync();

// Simple loading screen for web
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading Alora...</Text>
    </View>
  );
}

// Error screen if fonts fail to load
function FontErrorScreen({ error }: { error: Error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Failed to load fonts</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitBold: Outfit_700Bold,
  });
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Debug logging
    console.log("[RootLayout] Fonts loaded:", loaded);
    console.log("[RootLayout] Fonts error:", error);

    if (loaded || error) {
      console.log("[RootLayout] Hiding splash screen");
      SplashScreen.hideAsync();
      // Give a small delay to ensure smooth transition
      const timer = setTimeout(() => setShowLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loaded, error]);

  // Show loading screen while fonts are loading
  if (showLoading && !loaded && !error) {
    console.log("[RootLayout] Showing loading screen");
    return <LoadingScreen />;
  }

  // Show error screen if fonts failed to load
  if (error) {
    console.error("[RootLayout] Font loading error:", error);
    return <FontErrorScreen error={error} />;
  }

  console.log("[RootLayout] Rendering app");
  return (
    <ErrorBoundary>
      <QueryClientProviderWrapper>
        <ToastProvider>
          <ClerkProviderWrapper>
            <ConvexProviderWrapper>
              <Stack screenOptions={{ headerShown: false }} />
            </ConvexProviderWrapper>
          </ClerkProviderWrapper>
        </ToastProvider>
      </QueryClientProviderWrapper>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#94a3b8",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f87171",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});

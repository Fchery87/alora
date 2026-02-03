// Load Reanimated web shim before any animations
import "@/lib/reanimated-web-shim";
import "../global.css";

import { Stack } from "expo-router";
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_500Medium,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";
import {
  useFonts as useDMFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
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
      <ActivityIndicator size="large" color="#D4A574" />
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
  const [loadedHeading, errorHeading] = useFonts({
    CrimsonPro: CrimsonPro_400Regular,
    CrimsonProMedium: CrimsonPro_500Medium,
    CrimsonProBold: CrimsonPro_700Bold,
  });

  const [loadedBody, errorBody] = useDMFonts({
    DMSans: DMSans_400Regular,
    DMSansMedium: DMSans_500Medium,
    DMSansBold: DMSans_700Bold,
  });
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Debug logging
    console.log("[RootLayout] Heading fonts loaded:", loadedHeading);
    console.log("[RootLayout] Body fonts loaded:", loadedBody);
    console.log("[RootLayout] Fonts error:", errorHeading || errorBody);

    if ((loadedHeading && loadedBody) || errorHeading || errorBody) {
      console.log("[RootLayout] Hiding splash screen");
      SplashScreen.hideAsync();
      // Give a small delay to ensure smooth transition
      const timer = setTimeout(() => setShowLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loadedHeading, loadedBody, errorHeading, errorBody]);

  // Show loading screen while fonts are loading
  if (
    showLoading &&
    !(loadedHeading && loadedBody) &&
    !(errorHeading || errorBody)
  ) {
    console.log("[RootLayout] Showing loading screen");
    return <LoadingScreen />;
  }

  // Show error screen if fonts failed to load
  const fontError = errorHeading || errorBody;
  if (fontError) {
    console.error("[RootLayout] Font loading error:", fontError);
    return <FontErrorScreen error={fontError} />;
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
    backgroundColor: "#FAF7F2",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "DMSans",
    color: "#8B9A7D",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF7F2",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: "CrimsonProBold",
    color: "#D4A574",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "DMSans",
    color: "#2D2A26",
    textAlign: "center",
  },
});

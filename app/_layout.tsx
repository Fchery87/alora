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
import {
  useFonts as useOutfitFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { ClerkProviderWrapper } from "@/lib/clerk";
import { ConvexProviderWrapper } from "@/components/providers/ConvexProviderWrapper";
import { ToastProvider } from "@/components/atoms/Toast";
import { QueryClientProviderWrapper } from "@/components/providers/QueryClientProviderWrapper";
import { initSentry } from "@/lib/sentry";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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

  const [loadedUI, errorUI] = useOutfitFonts({
    Outfit: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitSemiBold: Outfit_600SemiBold,
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Debug logging
    console.log("[RootLayout] Heading fonts loaded:", loadedHeading);
    console.log("[RootLayout] Body fonts loaded:", loadedBody);
    console.log("[RootLayout] UI fonts loaded:", loadedUI);
    console.log(
      "[RootLayout] Fonts error:",
      errorHeading || errorBody || errorUI
    );

    if (
      (loadedHeading && loadedBody && loadedUI) ||
      errorHeading ||
      errorBody ||
      errorUI
    ) {
      console.log("[RootLayout] Hiding splash screen");
      SplashScreen.hideAsync().catch(() => {});
      // Give a small delay to ensure smooth transition
      const timer = setTimeout(() => setShowLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loadedHeading, loadedBody, loadedUI, errorHeading, errorBody, errorUI]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!showLoading) return;

    const fontError = errorHeading || errorBody || errorUI;
    if ((loadedHeading && loadedBody && loadedUI) || fontError) return;

    // On web, font loading can hang indefinitely (ad blockers, extensions, dev builds).
    // Don't hard-block app usage; fall back to system fonts after a short timeout.
    const timer = setTimeout(() => {
      console.warn(
        "[RootLayout] Font loading timed out on web; continuing without custom fonts"
      );
      SplashScreen.hideAsync().catch(() => {});
      setShowLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [
    showLoading,
    loadedHeading,
    loadedBody,
    loadedUI,
    errorHeading,
    errorBody,
    errorUI,
  ]);

  // Show loading screen while fonts are loading
  if (
    showLoading &&
    !(loadedHeading && loadedBody && loadedUI) &&
    !(errorHeading || errorBody || errorUI)
  ) {
    console.log("[RootLayout] Showing loading screen");
    return <LoadingScreen />;
  }

  // Show error screen if fonts failed to load
  const fontError = errorHeading || errorBody || errorUI;
  if (fontError) {
    // On web, font loading can time out due to extensions/ad blockers or slow dev builds.
    // Don't hard-block app usage; fall back to system fonts.
    if (Platform.OS !== "web") {
      console.error("[RootLayout] Font loading error:", fontError);
      return <FontErrorScreen error={fontError} />;
    }
    console.warn(
      "[RootLayout] Font loading error (ignored on web):",
      fontError
    );
  }

  console.log("[RootLayout] Rendering app");
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="auto">
        <QueryClientProviderWrapper>
          <ToastProvider>
            <ClerkProviderWrapper>
              <ConvexProviderWrapper>
                <Stack screenOptions={{ headerShown: false }} />
              </ConvexProviderWrapper>
            </ClerkProviderWrapper>
          </ToastProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
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

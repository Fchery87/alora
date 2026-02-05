// Load Reanimated web shim before any animations
import "@/lib/reanimated-web-shim";
import "../global.css";

import { Stack } from "expo-router";
import {
  useFonts as useLiterataFonts,
  Literata_400Regular,
  Literata_500Medium,
  Literata_600SemiBold,
} from "@expo-google-fonts/literata";
import {
  useFonts as usePlexSansFonts,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from "@expo-google-fonts/ibm-plex-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { BACKGROUND, COLORS, TEXT as THEME_TEXT } from "@/lib/theme";
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
      <ActivityIndicator size="large" color={COLORS.terracotta} />
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
  const [loadedCareHeading, errorCareHeading] = useLiterataFonts({
    CareJournalHeading: Literata_400Regular,
    CareJournalHeadingMedium: Literata_500Medium,
    CareJournalHeadingSemiBold: Literata_600SemiBold,
    // Back-compat aliases for legacy typography keys used across the app
    CrimsonPro: Literata_400Regular,
    CrimsonProMedium: Literata_500Medium,
    CrimsonProBold: Literata_600SemiBold,
  });

  const [loadedCareUI, errorCareUI] = usePlexSansFonts({
    CareJournalUI: IBMPlexSans_400Regular,
    CareJournalUIMedium: IBMPlexSans_500Medium,
    CareJournalUISemiBold: IBMPlexSans_600SemiBold,
    // Back-compat aliases for legacy UI typography keys used across the app
    DMSans: IBMPlexSans_400Regular,
    DMSansMedium: IBMPlexSans_500Medium,
    DMSansBold: IBMPlexSans_600SemiBold,
    Outfit: IBMPlexSans_400Regular,
    OutfitMedium: IBMPlexSans_500Medium,
    OutfitSemiBold: IBMPlexSans_600SemiBold,
    OutfitBold: IBMPlexSans_600SemiBold,
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Debug logging
    console.log("[RootLayout] Care heading fonts loaded:", loadedCareHeading);
    console.log("[RootLayout] Care UI fonts loaded:", loadedCareUI);
    console.log(
      "[RootLayout] Fonts error:",
      errorCareHeading || errorCareUI
    );

    if (
      (loadedCareHeading && loadedCareUI) ||
      errorCareHeading ||
      errorCareUI
    ) {
      console.log("[RootLayout] Hiding splash screen");
      SplashScreen.hideAsync().catch(() => {});
      // Give a small delay to ensure smooth transition
      const timer = setTimeout(() => setShowLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [
    loadedCareHeading,
    loadedCareUI,
    errorCareHeading,
    errorCareUI,
  ]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!showLoading) return;

    const fontError = errorCareHeading || errorCareUI;
    if ((loadedCareHeading && loadedCareUI) || fontError) return;

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
    loadedCareHeading,
    loadedCareUI,
    errorCareHeading,
    errorCareUI,
  ]);

  // Show loading screen while fonts are loading
  if (
    showLoading &&
    !(loadedCareHeading && loadedCareUI) &&
    !(errorCareHeading || errorCareUI)
  ) {
    console.log("[RootLayout] Showing loading screen");
    return <LoadingScreen />;
  }

  // Show error screen if fonts failed to load
  const fontError = errorCareHeading || errorCareUI;
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
    backgroundColor: BACKGROUND.primary,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: COLORS.sage,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND.primary,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: "CareJournalHeadingSemiBold",
    color: COLORS.terracotta,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "CareJournalUI",
    color: THEME_TEXT.primary,
    textAlign: "center",
  },
});

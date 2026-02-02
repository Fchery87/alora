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
import { useEffect } from "react";
import { ClerkProviderWrapper } from "@/lib/clerk";
import { ConvexProviderWrapper } from "@/components/providers/ConvexProviderWrapper";
import { ToastProvider } from "@/components/atoms/Toast";
import { QueryClientProviderWrapper } from "@/components/providers/QueryClientProviderWrapper";
import { initSentry } from "@/lib/sentry";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

// Initialize Sentry before app starts
initSentry();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitBold: Outfit_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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

import { ClerkProviderWrapper } from "@/lib/clerk";
import { ConvexProvider } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { TamaguiProvider } from "@tamagui/core";
import { tamaguiConfig } from "@/config/tamagui.config";
import { convex } from "@/lib/convex";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  const tamagui = useMemo(() => tamaguiConfig, []);

  useEffect(() => {
    let isMounted = true;

    const hideSplash = async () => {
      if (fontsLoaded && isMounted) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();

    return () => {
      isMounted = false;
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamagui}>
      <ClerkProviderWrapper>
        <ConvexProvider client={convex}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </ConvexProvider>
      </ClerkProviderWrapper>
    </TamaguiProvider>
  );
}

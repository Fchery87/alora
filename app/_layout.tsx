import { ClerkProviderWrapper } from "@/lib/clerk";
import { useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "@/config/tamagui.config";
import { convex } from "@/lib/convex";
import { isAuthBypassEnabled } from "@/lib/auth-bypass";
import { View, Text, StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  const tamagui = useMemo(() => tamaguiConfig, []);
  const authBypass = isAuthBypassEnabled();

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
      {authBypass ? (
        <View pointerEvents="none" style={styles.authBypassBanner}>
          <Text style={styles.authBypassText}>AUTH BYPASS ACTIVE</Text>
        </View>
      ) : null}
      <ClerkProviderWrapper>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </ConvexProviderWithClerk>
      </ClerkProviderWrapper>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  authBypassBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#111827",
  },
  authBypassText: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

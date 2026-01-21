import { useAuth } from "@clerk/clerk-expo";
import { useRouter, usePathname } from "expo-router";
import { useEffect, ReactNode } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { isAuthBypassEnabled } from "@/lib/auth-bypass";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authBypass = isAuthBypassEnabled();

  useEffect(() => {
    if (isLoaded && !isSignedIn && !authBypass) {
      const currentPath = pathname;
      router.replace({
        pathname: "/(auth)/login",
        params: { redirect: currentPath },
      });
    }
  }, [isSignedIn, isLoaded, pathname, router, authBypass]);

  if (!isLoaded && !authBypass) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!isSignedIn && !authBypass) {
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

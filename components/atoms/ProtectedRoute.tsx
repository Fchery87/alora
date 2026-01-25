import { useAuth } from "@clerk/clerk-expo";
import { useRouter, usePathname } from "expo-router";
import { useEffect, ReactNode } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

interface ProtectedRouteProps {
  children: ReactNode;
  requireOrganization?: boolean;
}

export function ProtectedRoute({
  children,
  requireOrganization = false,
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded, orgId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // auth bypass removed

  useEffect(() => {
    if (!isLoaded) return;

    if (isLoaded && !isSignedIn) {
      const currentPath = pathname;
      router.replace({
        pathname: "/(auth)/login",
        params: { redirect: currentPath },
      });
      return;
    }

    if (isSignedIn && requireOrganization && !orgId) {
      router.replace("/(auth)/onboarding");
    }
  }, [isSignedIn, isLoaded, orgId, pathname, requireOrganization, router]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (requireOrganization && !orgId) {
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

import { useAuth } from "@clerk/clerk-expo";
import { useRouter, usePathname } from "expo-router";
import { useEffect, ReactNode, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

interface ProtectedRouteProps {
  children: ReactNode;
  requireOrganization?: boolean;
}

export function ProtectedRoute({
  children,
  requireOrganization = false,
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded, orgId } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const ensureUser = useMutation((api as any).users.ensureUser);
  const ensureAttemptedRef = useRef(false);
  const [isEnsuringUser, setIsEnsuringUser] = useState(false);
  const [ensureError, setEnsureError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      ensureAttemptedRef.current = false;
      setIsEnsuringUser(false);
      setEnsureError(null);
      return;
    }

    if (requireOrganization && !orgId) {
      ensureAttemptedRef.current = false;
      setIsEnsuringUser(false);
      setEnsureError(null);
      return;
    }

    if (ensureAttemptedRef.current) return;
    ensureAttemptedRef.current = true;

    setIsEnsuringUser(true);
    setEnsureError(null);
    void ensureUser({})
      .catch((e: any) => {
        setEnsureError(e?.message ?? "Failed to initialize user");
      })
      .finally(() => {
        setIsEnsuringUser(false);
      });
  }, [ensureUser, isLoaded, isSignedIn, orgId, requireOrganization]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
      </View>
    );
  }

  if (isSignedIn && isEnsuringUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
      </View>
    );
  }

  if (isSignedIn && ensureError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Loading error</Text>
        <Text style={styles.errorText}>{ensureError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            ensureAttemptedRef.current = false;
            setEnsureError(null);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
    backgroundColor: BACKGROUND.primary,
    padding: 24,
  },
  errorTitle: {
    ...TYPOGRAPHY.headings.h3,
    marginBottom: 8,
    color: THEME_TEXT.primary,
    textAlign: "center",
  },
  errorText: {
    ...TYPOGRAPHY.body.small,
    color: THEME_TEXT.secondary,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.terracotta,
    ...SHADOWS.sm,
  },
  retryText: {
    ...TYPOGRAPHY.button,
    color: THEME_TEXT.primaryInverse,
  },
});

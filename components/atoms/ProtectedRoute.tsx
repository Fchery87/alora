import { useAuth } from "@clerk/clerk-expo";
import { useRouter, usePathname } from "expo-router";
import { useEffect, ReactNode, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (isSignedIn && isEnsuringUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
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
    backgroundColor: "#ffffff",
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  errorText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#6366f1",
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

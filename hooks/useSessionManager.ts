import { useEffect, useCallback, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { captureException, addBreadcrumb } from "@/lib/sentry";

interface SessionState {
  isValid: boolean;
  lastRefreshed: number | null;
  refreshAttempts: number;
}

/**
 * Hook to manage authentication session lifecycle
 * Handles token refresh, expiration detection, and graceful degradation
 */
export function useSessionManager() {
  const { isSignedIn, isLoaded, getToken, signOut } = useAuth();
  const [sessionState, setSessionState] = useState<SessionState>({
    isValid: false,
    lastRefreshed: null,
    refreshAttempts: 0,
  });
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxRefreshAttempts = 3;

  /**
   * Refresh the authentication token
   */
  const refreshToken = useCallback(async () => {
    if (!isSignedIn || !isLoaded) {
      return false;
    }

    try {
      addBreadcrumb("Refreshing auth token", "auth", "info");

      // Get fresh token (this will refresh if needed)
      const token = await getToken({
        template: "convex",
        skipCache: true,
      });

      if (token) {
        setSessionState({
          isValid: true,
          lastRefreshed: Date.now(),
          refreshAttempts: 0,
        });

        addBreadcrumb("Token refreshed successfully", "auth", "info");
        return true;
      } else {
        throw new Error("Failed to get token");
      }
    } catch (error) {
      setSessionState((prev) => ({
        ...prev,
        refreshAttempts: prev.refreshAttempts + 1,
      }));

      addBreadcrumb("Token refresh failed", "auth", "error", {
        attempt: sessionState.refreshAttempts + 1,
      });

      // If we've tried too many times, sign the user out
      if (sessionState.refreshAttempts >= maxRefreshAttempts) {
        captureException(error as Error, { context: "token_refresh" });

        // Clear session and redirect to login
        await signOut();
        router.replace("/(auth)/login");

        addBreadcrumb(
          "User signed out due to token refresh failure",
          "auth",
          "error"
        );
      }

      return false;
    }
  }, [isSignedIn, isLoaded, getToken, signOut, sessionState.refreshAttempts]);

  /**
   * Check if token needs refresh (every 10 minutes)
   */
  const setupTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Refresh token every 10 minutes while app is active
    refreshTimerRef.current = setInterval(
      () => {
        if (isSignedIn) {
          refreshToken();
        }
      },
      10 * 60 * 1000
    ); // 10 minutes

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [isSignedIn, refreshToken]);

  /**
   * Handle 401 errors from Convex
   */
  const handleAuthError = useCallback(
    async (error: any) => {
      if (
        error?.message?.includes("Not authenticated") ||
        error?.message?.includes("Unauthorized")
      ) {
        addBreadcrumb("Authentication error detected", "auth", "error", {
          error: error.message,
        });

        // Try to refresh token
        const refreshed = await refreshToken();

        if (!refreshed) {
          // Token refresh failed, sign out
          await signOut();
          router.replace("/(auth)/login");
        }

        return !refreshed; // Return true if we needed to sign out
      }

      return false;
    },
    [refreshToken, signOut]
  );

  // Setup token refresh on mount and when auth state changes
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Initial token refresh
      refreshToken();

      // Setup periodic refresh
      const cleanup = setupTokenRefresh();

      return cleanup;
    }
  }, [isLoaded, isSignedIn, refreshToken, setupTokenRefresh]);

  // Monitor session validity
  useEffect(() => {
    if (isLoaded && !isSignedIn && sessionState.isValid) {
      // User was signed out externally
      setSessionState({
        isValid: false,
        lastRefreshed: null,
        refreshAttempts: 0,
      });

      addBreadcrumb("Session invalidated", "auth", "warning");
    }
  }, [isLoaded, isSignedIn, sessionState.isValid]);

  return {
    isSessionValid: sessionState.isValid,
    lastRefreshed: sessionState.lastRefreshed,
    refreshAttempts: sessionState.refreshAttempts,
    refreshToken,
    handleAuthError,
  };
}

/**
 * Hook to monitor app state and handle background/foreground transitions
 */
export function useAppStateSession() {
  const { isSignedIn, isLoaded } = useAuth();
  const { refreshToken } = useSessionManager();
  const lastActiveRef = useRef<number>(Date.now());

  useEffect(() => {
    // Refresh token when app comes to foreground after being inactive
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        const timeAway = Date.now() - lastActiveRef.current;

        // If app was inactive for more than 5 minutes, refresh token
        if (timeAway > 5 * 60 * 1000 && isSignedIn) {
          addBreadcrumb(
            "App resumed after inactivity, refreshing token",
            "auth",
            "info",
            {
              inactiveDuration: timeAway,
            }
          );
          refreshToken();
        }

        lastActiveRef.current = Date.now();
      }
    };

    // Note: In a real implementation, you'd use AppState from react-native
    // This is a simplified version

    return () => {
      lastActiveRef.current = Date.now();
    };
  }, [isSignedIn, isLoaded, refreshToken]);
}

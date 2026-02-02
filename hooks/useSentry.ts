import { useEffect } from "react";
import { useAuth, useUser, useOrganization } from "@clerk/clerk-expo";
import { setSentryUser, clearSentryUser, addBreadcrumb } from "@/lib/sentry";

/**
 * Hook to sync Clerk user with Sentry error tracking
 * Automatically sets/clears user context based on auth state
 */
export function useSentryUser() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  useEffect(() => {
    if (isSignedIn && userId) {
      // Set user context in Sentry
      setSentryUser(
        userId,
        user?.primaryEmailAddress?.emailAddress,
        organization?.id
      );

      addBreadcrumb("User signed in", "auth", "info", {
        userId,
        organizationId: organization?.id,
      });
    } else {
      // Clear user context when signed out
      clearSentryUser();
    }
  }, [isSignedIn, userId, user, organization]);
}

/**
 * Hook to track navigation breadcrumbs
 */
export function useNavigationBreadcrumbs() {
  // This can be extended with expo-router navigation state
  // For now, we'll add manual breadcrumbs where needed
  return {
    trackScreen: (screenName: string, params?: Record<string, any>) => {
      addBreadcrumb(`Navigated to ${screenName}`, "navigation", "info", params);
    },
    trackAction: (action: string, details?: Record<string, any>) => {
      addBreadcrumb(action, "user_action", "info", details);
    },
  };
}

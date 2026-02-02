import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const RELEASE = Constants.expoConfig?.version || "1.0.0";
const BUILD = String(Constants.expoConfig?.android?.versionCode || "1");

/**
 * Initialize Sentry for error tracking
 * Call this once at app startup
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn("Sentry DSN not configured - error tracking disabled");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: `alora@${RELEASE}`,
    dist: BUILD,

    // Enable native crash reporting
    enableNativeCrashHandling: true,
    enableNativeNagger: false,

    // Performance monitoring
    tracesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,

    // Debug mode in development
    debug: ENVIRONMENT === "development",

    // Before sending, sanitize sensitive data
    beforeSend: (event) => {
      // Remove potentially sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers?.["Authorization"];
        delete event.request.headers?.["authorization"];
      }

      // Filter out known non-actionable errors
      if (event.exception?.values?.[0]?.type === "NetworkError") {
        // Don't send network errors in development
        if (ENVIRONMENT === "development") {
          return null;
        }
      }

      return event;
    },

    // Configure breadcrumbs
    maxBreadcrumbs: 100,

    // Attach user context
    initialScope: {
      tags: {
        platform: Constants.platform?.ios ? "ios" : "android",
        appVersion: RELEASE,
      },
    },
  });

  console.log("Sentry initialized:", {
    environment: ENVIRONMENT,
    release: RELEASE,
    build: BUILD,
  });
}

/**
 * Set user context for Sentry
 * Call this when user logs in
 */
export function setSentryUser(
  userId: string,
  email?: string,
  organizationId?: string
) {
  Sentry.setUser({
    id: userId,
    email: email || undefined,
  });

  if (organizationId) {
    Sentry.setTag("organization", organizationId);
  }
}

/**
 * Clear user context on logout
 */
export function clearSentryUser() {
  Sentry.setUser(null);
  Sentry.setTag("organization", "");
}

/**
 * Add breadcrumb for user actions
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category: category || "action",
    level,
    data,
    timestamp: Date.now(),
  });
}

/**
 * Capture an exception manually
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info"
) {
  Sentry.captureMessage(message, level);
}

// Export Sentry for direct access if needed
export { Sentry };

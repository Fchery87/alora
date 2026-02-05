import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./token-cache";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";

function getClerkPublishableKey() {
  const extra = Constants.expoConfig?.extra as
    | Record<string, unknown>
    | undefined;

  const fromExtra =
    (typeof extra?.clerkPublishableKey === "string"
      ? extra.clerkPublishableKey
      : undefined) ?? undefined;

  const fromEnv =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_PUBLISHABLE_KEY ||
    "";

  return {
    key: fromExtra || fromEnv,
    hasExtra: Boolean(fromExtra),
    hasEnv: Boolean(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY),
  };
}

function isLikelyPublishableKey(key: string) {
  if (!key) return false;
  if (!/^pk_(test|live)_/.test(key)) return false;
  if (key.includes("...")) return false;
  if (key.endsWith("_xxxx")) return false;
  // Avoid overly strict formatting checks: Clerk key bodies may change over time.
  return key.length >= 20;
}

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { key: publishableKey, hasExtra, hasEnv } = getClerkPublishableKey();
  const isValidKey = isLikelyPublishableKey(publishableKey);

  if (__DEV__) {
    console.log("[Clerk] Publishable key available:", publishableKey ? "Yes" : "No");
    console.log("[Clerk] Source available:", { hasExtra, hasEnv });
    console.log(
      "[Clerk] Key fingerprint:",
      publishableKey
        ? { prefix: publishableKey.slice(0, 8), length: publishableKey.length }
        : { prefix: "N/A", length: 0 }
    );
    console.log("[Clerk] Key is valid:", isValidKey);
  }

  if (!isValidKey) {
    const hasAnyKey = Boolean(publishableKey);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Setup Required</Text>
        <Text style={styles.subtitle}>
          {hasAnyKey
            ? "A Clerk key was found, but it doesn't look like a publishable key."
            : "Please add your Clerk Publishable Key to your .env file:"}
        </Text>
        <Text style={styles.envVar}>
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
        </Text>
        <Text style={styles.note}>
          After editing .env, restart the Expo dev server (stop it and re-run{" "}
          <Text style={styles.mono}>bun run web -- --clear</Text>).
        </Text>
        {__DEV__ ? (
          <Text style={styles.debug}>
            Debug: extra={String(hasExtra)} env={String(hasEnv)}{" "}
            prefix={publishableKey ? publishableKey.slice(0, 8) : "N/A"} len=
            {publishableKey ? publishableKey.length : 0}
          </Text>
        ) : null}
        <Text style={styles.helpText}>
          Get your key from:
          https://dashboard.clerk.com/last-active?path=api-keys
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  envVar: {
    fontSize: 12,
    marginTop: 10,
    color: "#999",
    fontFamily: "monospace",
  },
  note: {
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
    color: "#666",
    maxWidth: 520,
  },
  mono: {
    fontFamily: "monospace",
    color: "#444",
  },
  debug: {
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
    color: "#888",
    fontFamily: "monospace",
  },
  helpText: {
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
});

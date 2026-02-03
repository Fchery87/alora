import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./token-cache";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";

// Try multiple sources for the publishable key
const publishableKey =
  (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined) ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "";

console.log(
  "[Clerk] Publishable key available:",
  publishableKey ? "Yes" : "No"
);
console.log(
  "[Clerk] Key starts with:",
  publishableKey ? publishableKey.substring(0, 10) + "..." : "N/A"
);

const isValidKey = Boolean(
  publishableKey &&
  /^pk_(test|live)_[A-Za-z0-9]+$/.test(publishableKey) &&
  !publishableKey.endsWith("_xxxx")
);

console.log("[Clerk] Key is valid:", isValidKey);

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isValidKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Setup Required</Text>
        <Text style={styles.subtitle}>
          Please add your Clerk Publishable Key to .env file:
        </Text>
        <Text style={styles.envVar}>
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
        </Text>
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
  helpText: {
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    color: "#666",
  },
});

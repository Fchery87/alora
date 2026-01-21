import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./token-cache";
import Constants from "expo-constants";
import { Text, View } from "react-native";

const publishableKey =
  (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined) ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const isValidKey = Boolean(
  publishableKey &&
    /^pk_(test|live)_[A-Za-z0-9]+$/.test(publishableKey) &&
    !publishableKey.endsWith("_xxxx")
);

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isValidKey) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
          Setup Required
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center", color: "#666" }}>
          Please add your Clerk Publishable Key to .env file:
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 10,
            color: "#999",
            fontFamily: "monospace",
          }}
        >
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginTop: 20,
            textAlign: "center",
            color: "#666",
          }}
        >
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

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./token-cache";
import Constants from "expo-constants";

const publishableKey = Constants.expoConfig?.extra
  ?.clerkPublishableKey as string;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

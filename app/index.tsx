import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { isAuthBypassEnabled } from "@/lib/auth-bypass";

export default function IndexScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const authBypass = isAuthBypassEnabled();

  if (!isLoaded && !authBypass) {
    return null;
  }

  if (isSignedIn || authBypass) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}

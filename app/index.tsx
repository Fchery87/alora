import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function IndexScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}

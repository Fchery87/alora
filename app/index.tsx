import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { getInitialHref } from "@/lib/routing";

export default function IndexScreen() {
  const { isSignedIn, isLoaded, orgId } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return <Redirect href={getInitialHref({ isSignedIn, orgId })} />;
}

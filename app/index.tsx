import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { getInitialHref } from "@/lib/routing";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function IndexScreen() {
  const { isSignedIn, isLoaded, orgId } = useAuth();

  console.log(
    "[IndexScreen] Auth loaded:",
    isLoaded,
    "Signed in:",
    isSignedIn,
    "OrgId:",
    orgId
  );

  if (!isLoaded) {
    console.log("[IndexScreen] Auth not loaded yet, showing loading");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const href = getInitialHref({ isSignedIn, orgId });
  console.log("[IndexScreen] Redirecting to:", href);

  return <Redirect href={href} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});

import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { getInitialHref } from "@/lib/routing";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { AloraLogo } from "@/components/atoms/AloraLogo";
import { COLORS, BACKGROUND } from "@/lib/theme";

export default function IndexScreen() {
  // If there's a "pending" session (common during auth transitions on web),
  // treat it as signed-in so we don't bounce back to login.
  const { isSignedIn, isLoaded, orgId } = useAuth({
    treatPendingAsSignedOut: false,
  });

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
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 600 }}
          style={styles.logoContainer}
        >
          <AloraLogo size={120} showText={true} />
        </MotiView>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 400, duration: 400 }}
        >
          <ActivityIndicator
            size="large"
            color={COLORS.terracotta}
            style={styles.loader}
          />
        </MotiView>
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
    backgroundColor: BACKGROUND.primary,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});

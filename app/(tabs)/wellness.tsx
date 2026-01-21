import { View, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { isAuthBypassEnabled } from "@/lib/auth-bypass";

export default function WellnessScreen() {
  const { isSignedIn } = useAuth();
  const authBypass = isAuthBypassEnabled();

  if (!isSignedIn && !authBypass) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Wellness - Coming Soon</Text>
    </View>
  );
}

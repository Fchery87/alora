import { View, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function CalendarScreen() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Calendar - Coming Soon</Text>
    </View>
  );
}

import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/organisms/CalendarView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { isAuthBypassEnabled } from "@/lib/auth-bypass";

export default function CalendarScreen() {
  const { isSignedIn } = useAuth();
  const authBypass = isAuthBypassEnabled();

  if (!isSignedIn && !authBypass) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Calendar" showBackButton={false} />
      <CalendarView />
    </View>
  );
}

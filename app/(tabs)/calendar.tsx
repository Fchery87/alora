import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/organisms/CalendarView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function CalendarScreen() {
  const { isSignedIn } = useAuth();
  // auth bypass removed

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Calendar" showBackButton={false} />
      <CalendarView />
    </View>
  );
}

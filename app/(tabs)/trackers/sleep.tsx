import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { SleepTracker } from "@/components/organisms/SleepTracker";

export default function SleepTrackerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Log Sleep" showBackButton />
      <SleepTracker babyId="default-baby" />
    </View>
  );
}

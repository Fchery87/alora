import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { MoodCheckIn } from "@/components/organisms/MoodCheckIn";

export default function MoodTrackerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Mood Check-In" showBackButton />
      <MoodCheckIn />
    </View>
  );
}

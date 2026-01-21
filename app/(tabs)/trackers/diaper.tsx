import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";

export default function DiaperTrackerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Log Diaper" showBackButton />
      <DiaperTracker babyId="default-baby" />
    </View>
  );
}

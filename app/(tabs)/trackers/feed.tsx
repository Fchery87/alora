import { View, Text } from "react-native";
import { FeedForm } from "@/components/organisms";
import { Header } from "@/components/layout/Header";

export default function FeedTrackerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Feed Tracker" showBackButton />
      <FeedForm babyId="default-baby" />
    </View>
  );
}

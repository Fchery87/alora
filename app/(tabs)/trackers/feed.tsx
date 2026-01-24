import { useState } from "react";
import { View, Text } from "react-native";
import { FeedForm } from "@/components/organisms";
import { Header } from "@/components/layout/Header";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";

export default function FeedTrackerScreen() {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Feed Tracker" showBackButton />
      {selectedBabyId ? (
        <FeedForm babyId={selectedBabyId} />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No baby selected</Text>
        </View>
      )}
      <BabySelectorModal
        visible={showBabySelector}
        onClose={() => setShowBabySelector(false)}
      />
    </View>
  );
}

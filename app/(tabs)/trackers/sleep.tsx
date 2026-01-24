import { useState } from "react";
import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { SleepTracker } from "@/components/organisms/SleepTracker";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";

export default function SleepTrackerScreen() {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Log Sleep" showBackButton />
      {selectedBabyId ? (
        <SleepTracker babyId={selectedBabyId} />
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

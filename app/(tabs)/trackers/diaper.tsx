import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";

export default function DiaperTrackerScreen() {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={styles.screen}>
      <Header title="Log Diaper" showBackButton />
      {selectedBabyId ? (
        <DiaperTracker babyId={selectedBabyId} />
      ) : (
        <View style={styles.emptyState}>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

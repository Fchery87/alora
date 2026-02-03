import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";

// Celestial Nurture Design System Colors
const COLORS = {
  background: "#FAF7F2",
  primary: "#D4A574", // Terracotta
  secondary: "#8B9A7D", // Sage
  accent: "#C9A227", // Gold
  textPrimary: "#2D2A26",
  textSecondary: "#6B6560",
};

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
          <Text style={styles.emptyStateText}>No baby selected</Text>
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
    backgroundColor: COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    fontFamily: "DMSans-Regular",
    fontSize: 16,
  },
});

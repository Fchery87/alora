import { View, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { MoodCheckIn } from "@/components/organisms/MoodCheckIn";

// Celestial Nurture Design System Colors
const COLORS = {
  background: "#FAF7F2",
  primary: "#D4A574", // Terracotta
  secondary: "#8B9A7D", // Sage
  accent: "#C9A227", // Gold
  textPrimary: "#2D2A26",
  textSecondary: "#6B6560",
  mood: "#E8B86D", // Warm gold for mood
};

export default function MoodTrackerScreen() {
  return (
    <View style={styles.screen}>
      <Header title="Mood Check-In" showBackButton />
      <MoodCheckIn />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

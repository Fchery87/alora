import { View, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { MoodCheckIn } from "@/components/organisms/MoodCheckIn";
import { BACKGROUND } from "@/lib/theme";

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
    backgroundColor: BACKGROUND.primary,
  },
});

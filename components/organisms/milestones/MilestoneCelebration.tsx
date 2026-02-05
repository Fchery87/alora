import { View, StyleSheet, Modal, Text } from "react-native";
import { Confetti } from "@/components/atoms/Confetti";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

interface MilestoneCelebrationProps {
  visible: boolean;
  milestoneTitle: string;
  onClose: () => void;
}

export function MilestoneCelebration({
  visible,
  milestoneTitle,
  onClose,
}: MilestoneCelebrationProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Confetti />
        <View style={styles.container}>
          <View style={styles.celebrationCircle}>
            <Text style={styles.emoji}>🎉</Text>
          </View>
          <Text style={styles.title}>Amazing!</Text>
          <Text style={styles.milestone}>{milestoneTitle}</Text>
          <Text style={styles.subtitle}>A moment to cherish forever</Text>
          <Text style={styles.closeHint} onPress={onClose}>
            Tap to continue
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: BACKGROUND.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: BACKGROUND.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    minWidth: 280,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.lg,
  },
  celebrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BACKGROUND.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    ...TYPOGRAPHY.headings.h1,
    color: THEME_TEXT.primary,
    marginBottom: 8,
  },
  milestone: {
    ...TYPOGRAPHY.headings.h3,
    color: COLORS.terracotta,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body.regular,
    color: THEME_TEXT.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  closeHint: {
    ...TYPOGRAPHY.body.small,
    color: THEME_TEXT.tertiary,
  },
});

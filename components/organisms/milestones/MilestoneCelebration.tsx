import { useEffect } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { Confetti } from "@/components/atoms/Confetti";

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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    minWidth: 280,
  },
  celebrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  milestone: {
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  closeHint: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

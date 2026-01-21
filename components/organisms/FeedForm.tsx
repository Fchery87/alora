import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateFeed } from "@/hooks/queries/useFeeds";

type FeedType = "breast" | "formula" | "solid";

interface FeedFormProps {
  babyId: string;
  onSuccess?: () => void;
}

export function FeedForm({ babyId, onSuccess }: FeedFormProps) {
  const [type, setType] = useState<FeedType>("breast");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [side, setSide] = useState<"left" | "right" | "both">("left");

  const createFeedMutation = useCreateFeed();
  const createFeed = createFeedMutation as unknown as (args: any) => void;

  const feedTypes: { value: FeedType; label: string; icon: string }[] = [
    { value: "breast", label: "Breast", icon: "heart-circle-outline" },
    { value: "formula", label: "Formula", icon: "water-outline" },
    { value: "solid", label: "Solid", icon: "restaurant-outline" },
  ];

  const handleSubmit = async () => {
    if (!duration) return;

    try {
      createFeed({
        babyId: babyId as any,
        type,
        startTime: Date.now(),
        duration: parseInt(duration, 10),
        side: type === "breast" ? side : undefined,
        notes: notes || undefined,
      });

      setDuration("");
      setNotes("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to log feed:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Feeding</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {feedTypes.map((feedType) => (
            <TouchableOpacity
              key={feedType.value}
              style={[
                styles.typeButton,
                type === feedType.value && styles.typeButtonActive,
              ]}
              onPress={() => setType(feedType.value)}
            >
              <Ionicons
                name={feedType.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={type === feedType.value ? "#fff" : "#6366f1"}
              />
              <Text
                style={[
                  styles.typeText,
                  type === feedType.value && styles.typeTextActive,
                ]}
              >
                {feedType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {type === "breast" && (
        <View style={styles.section}>
          <Text style={styles.label}>Side</Text>
          <View style={styles.sideContainer}>
            {(["left", "right", "both"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sideButton,
                  side === s && styles.sideButtonActive,
                ]}
                onPress={() => setSide(s)}
              >
                <Text
                  style={[styles.sideText, side === s && styles.sideTextActive]}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter duration"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add any notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={!duration}
      >
        <Text style={styles.submitButtonText}>Log Feeding</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  typeButtonActive: {
    borderColor: "#6366f1",
    backgroundColor: "#6366f1",
  },
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  typeTextActive: {
    color: "#ffffff",
  },
  sideContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sideButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sideButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  sideText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  sideTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

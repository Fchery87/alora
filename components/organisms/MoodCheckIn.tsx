import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useCreateMood } from "@/hooks/queries/useMoodCheckIns";
import {
  validateMood,
  type MoodFormData,
  hasFieldError,
} from "@/lib/validation";
import { parseError, logError, getUserFriendlyMessage } from "@/lib/errors";
import { useToast } from "@/components/atoms/Toast";

type MoodType = "great" | "good" | "okay" | "low" | "struggling";
type EnergyType = "high" | "medium" | "low";

interface MoodCheckInProps {
  babyId?: string;
  onSuccess?: () => void;
}

export function MoodCheckIn({ babyId, onSuccess }: MoodCheckInProps) {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [energy, setEnergy] = useState<EnergyType | null>(null);
  const [anxiety, setAnxiety] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const toast = useToast();
  const createMood = useCreateMood();

  const moods: {
    value: MoodType;
    label: string;
    emoji: string;
    color: string;
  }[] = [
    { value: "great", label: "Great", emoji: "😊", color: "#10b981" },
    { value: "good", label: "Good", emoji: "🙂", color: "#6ee7b7" },
    { value: "okay", label: "Okay", emoji: "😐", color: "#fcd34d" },
    { value: "low", label: "Low", emoji: "😔", color: "#fb923c" },
    { value: "struggling", label: "Struggling", emoji: "😢", color: "#f87171" },
  ];

  const energyLevels: { value: EnergyType; label: string; icon: string }[] = [
    { value: "high", label: "High", icon: "bolt" },
    { value: "medium", label: "Medium", icon: "ellipse" },
    { value: "low", label: "Low", icon: "remove" },
  ];

  const validate = () => {
    const formData: Partial<MoodFormData> = {
      mood: mood || undefined,
      energy: energy || undefined,
      anxiety: anxiety || undefined,
      notes: notes || undefined,
    };

    const result = validateMood(formData);
    const errors: Record<string, string> = {};

    result.errors.forEach((error) => {
      errors[error.field] = error.message;
    });

    setValidationErrors(errors);
    return result.isValid;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    setTouched({ mood: true });

    if (!validate()) {
      toast.error("Validation Error", "Please select a mood before submitting");
      return;
    }

    try {
      await createMood.mutateAsync({
        babyId: babyId as any,
        mood: mood!,
        energy: energy || undefined,
        anxiety: anxiety || undefined,
        notes: notes || undefined,
      });

      setMood(null);
      setEnergy(null);
      setAnxiety(null);
      setNotes("");
      setShowDetails(false);
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Mood Logged",
        "Your mood check-in has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, { context: "MoodCheckIn", mood });

      toast.error("Failed to Log Mood", getUserFriendlyMessage(appError));
    }
  };

  const affirmations = [
    "You're doing a great job.",
    "It's okay to have tough days.",
    "Every day with your baby is precious.",
    "Be gentle with yourself.",
    "You're exactly the parent your baby needs.",
  ];

  const randomAffirmation =
    affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How are you feeling?</Text>

      <View style={styles.affirmationBox}>
        <Ionicons name="heart" size={20} color="#f472b6" />
        <Text style={styles.affirmationText}>{randomAffirmation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Your mood</Text>
        <View style={styles.moodGrid}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[
                styles.moodButton,
                mood === m.value && { backgroundColor: m.color },
                touched.mood &&
                  hasFieldError(validateMood({ mood: m.value }), "mood") &&
                  styles.moodButtonError,
              ]}
              onPress={() => {
                setMood(m.value);
                handleBlur("mood");
              }}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  mood === m.value && styles.moodLabelActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {touched.mood && validationErrors.mood && (
          <Text style={styles.errorText}>{validationErrors.mood}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.detailsToggle}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.detailsToggleText}>Add more details</Text>
        <Ionicons
          name={showDetails ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6366f1"
        />
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.detailsSection}>
          <View style={styles.section}>
            <Text style={styles.label}>Energy level</Text>
            <View style={styles.energyContainer}>
              {energyLevels.map((e) => (
                <TouchableOpacity
                  key={e.value}
                  style={[
                    styles.energyButton,
                    energy === e.value && styles.energyButtonActive,
                  ]}
                  onPress={() => setEnergy(e.value)}
                >
                  <Ionicons
                    name={e.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={energy === e.value ? "#fff" : "#6366f1"}
                  />
                  <Text
                    style={[
                      styles.energyLabel,
                      energy === e.value && styles.energyLabelActive,
                    ]}
                  >
                    {e.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Feeling anxious?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  anxiety === true && styles.yesNoButtonActive,
                ]}
                onPress={() => setAnxiety(true)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    anxiety === true && styles.yesNoTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  anxiety === false && styles.yesNoButtonActive,
                ]}
                onPress={() => setAnxiety(false)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    anxiety === false && styles.yesNoTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={StyleSheet.flatten(
                [
                  styles.input,
                  styles.notesInput,
                  touched.notes && validationErrors.notes
                    ? styles.inputError
                    : undefined,
                ].filter(Boolean)
              )}
              placeholder="What's on your mind?"
              value={notes}
              onChangeText={(text) => {
                setNotes(text);
                if (touched.notes) validate();
              }}
              onBlur={() => handleBlur("notes")}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {touched.notes && validationErrors.notes && (
              <Text style={styles.errorText}>{validationErrors.notes}</Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!mood || createMood.isPending) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!mood || createMood.isPending}
      >
        <Text style={styles.submitButtonText}>
          {createMood.isPending ? "Saving..." : "Check In"}
        </Text>
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
    marginBottom: 16,
  },
  affirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fce7f3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  affirmationText: {
    flex: 1,
    fontSize: 14,
    color: "#be185d",
    fontStyle: "italic",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  moodButton: {
    width: "30%",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  moodLabelActive: {
    color: "#fff",
  },
  moodButtonError: {
    borderColor: "#ef4444",
    borderWidth: 3,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
  },
  detailsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  detailsToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  detailsSection: {
    marginBottom: 20,
  },
  energyContainer: {
    flexDirection: "row",
    gap: 12,
  },
  energyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  energyButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  energyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  energyLabelActive: {
    color: "#fff",
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  yesNoButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  yesNoButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  yesNoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  yesNoTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputError: {
    borderColor: "#ef4444",
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
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

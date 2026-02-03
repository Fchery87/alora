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

// Celestial Nurture Design System - Earth Tones
const COLORS = {
  cream: "#FAF7F2",
  terracotta: "#D4A574",
  sage: "#8B9A7D",
  moss: "#6B7A6B",
  gold: "#C9A227",
  clay: "#C17A5C",
  warmDark: "#2D2A26",
  warmGray: "#6B6560",
  stone: "#8B8680",
  sand: "#E8E0D5",
  warmLight: "#F5F0E8",
  white: "#FFFFFF",
  error: "#C75B5B",
};

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
    { value: "great", label: "Great", emoji: "😊", color: COLORS.sage },
    { value: "good", label: "Good", emoji: "🙂", color: "#9CB89A" },
    { value: "okay", label: "Okay", emoji: "😐", color: COLORS.gold },
    { value: "low", label: "Low", emoji: "😔", color: COLORS.clay },
    {
      value: "struggling",
      label: "Struggling",
      emoji: "😢",
      color: COLORS.terracotta,
    },
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
        <Ionicons name="heart" size={20} color={COLORS.terracotta} />
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
                mood === m.value && {
                  backgroundColor: m.color,
                  borderColor: m.color,
                },
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
          color={COLORS.terracotta}
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
                    color={energy === e.value ? COLORS.white : COLORS.gold}
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
              placeholderTextColor={COLORS.stone}
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
    backgroundColor: COLORS.cream,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.warmDark,
    marginBottom: 16,
  },
  affirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warmLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  affirmationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.warmGray,
    fontStyle: "italic",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmGray,
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
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.sand,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.warmDark,
  },
  moodLabelActive: {
    color: COLORS.white,
  },
  moodButtonError: {
    borderColor: COLORS.error,
    borderWidth: 3,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
  detailsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.sand,
    marginBottom: 24,
  },
  detailsToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.terracotta,
  },
  detailsSection: {
    marginBottom: 24,
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
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.sand,
    gap: 8,
  },
  energyButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  energyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.warmDark,
  },
  energyLabelActive: {
    color: COLORS.white,
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  yesNoButton: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  yesNoButtonActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  yesNoText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmDark,
  },
  yesNoTextActive: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.sand,
    color: COLORS.warmDark,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.terracotta,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

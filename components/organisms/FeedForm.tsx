import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateFeed } from "@/hooks/queries/useFeeds";
import {
  validateFeed,
  type FeedFormData,
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const createFeedMutation = useCreateFeed();
  const createFeed = createFeedMutation as unknown as (args: any) => void;

  const feedTypes: { value: FeedType; label: string; icon: string }[] = [
    { value: "breast", label: "Breast", icon: "heart-circle-outline" },
    { value: "formula", label: "Formula", icon: "water-outline" },
    { value: "solid", label: "Solid", icon: "restaurant-outline" },
  ];

  // Validate form in real-time
  const validate = () => {
    const formData: Partial<FeedFormData> = {
      type,
      duration,
      side: type === "breast" ? side : undefined,
      notes: notes || undefined,
    };

    const result = validateFeed(formData);
    const errors: Record<string, string> = {};

    result.errors.forEach((error) => {
      errors[error.field] = error.message;
    });

    setValidationErrors(errors);
    return result.isValid;
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // Handle submit
  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Mark all fields as touched
    setTouched({ type: true, duration: true, side: true });

    // Validate
    if (!validate()) {
      toast.error(
        "Validation Error",
        "Please fix the errors before submitting"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeed({
        babyId: babyId as any,
        type,
        startTime: Date.now(),
        duration: parseInt(duration, 10),
        side: type === "breast" ? side : undefined,
        notes: notes || undefined,
      });

      setDuration("");
      setNotes("");
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Feeding Logged",
        "The feeding record has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, { context: "FeedForm", type, duration });

      toast.error("Failed to Log Feeding", getUserFriendlyMessage(appError));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = () => {
    const formData: Partial<FeedFormData> = {
      type,
      duration,
      side: type === "breast" ? side : undefined,
    };
    const result = validateFeed(formData);
    return result.isValid;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Log Feeding</Text>

      {/* Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {feedTypes.map((feedType) => (
            <TouchableOpacity
              key={feedType.value}
              style={[
                styles.typeButton,
                type === feedType.value && styles.typeButtonActive,
                touched.type &&
                  hasFieldError(
                    validateFeed({ type: feedType.value, duration, side }),
                    "type"
                  ) &&
                  styles.typeButtonError,
              ]}
              onPress={() => {
                setType(feedType.value);
                handleBlur("type");
              }}
            >
              <Ionicons
                name={feedType.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={
                  type === feedType.value ? COLORS.white : COLORS.terracotta
                }
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
        {touched.type && validationErrors.type && (
          <Text style={styles.errorText}>{validationErrors.type}</Text>
        )}
      </View>

      {/* Side Selection (for breastfeeding) */}
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
                  touched.side &&
                    hasFieldError(
                      validateFeed({ type, duration, side }),
                      "side"
                    ) &&
                    styles.sideButtonError,
                ]}
                onPress={() => {
                  setSide(s);
                  handleBlur("side");
                }}
              >
                <Text
                  style={[styles.sideText, side === s && styles.sideTextActive]}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {touched.side && validationErrors.side && (
            <Text style={styles.errorText}>{validationErrors.side}</Text>
          )}
        </View>
      )}

      {/* Duration Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={StyleSheet.flatten([
            styles.input,
            touched.duration && validationErrors.duration
              ? styles.inputError
              : undefined,
          ])}
          placeholder="Enter duration"
          value={duration}
          onChangeText={(value) => {
            setDuration(value);
            if (touched.duration) validate();
          }}
          onBlur={() => handleBlur("duration")}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          placeholderTextColor={COLORS.stone}
        />
        {touched.duration && validationErrors.duration && (
          <Text style={styles.errorText}>{validationErrors.duration}</Text>
        )}
      </View>

      {/* Notes Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add any notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor={COLORS.stone}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!isValid() || isSubmitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isValid() || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Logging..." : "Log Feeding"}
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmGray,
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.sand,
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeButtonActive: {
    borderColor: COLORS.terracotta,
    backgroundColor: COLORS.terracotta,
  },
  typeButtonError: {
    borderColor: COLORS.error,
  },
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.terracotta,
  },
  typeTextActive: {
    color: COLORS.white,
  },
  sideContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sideButton: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  sideButtonActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  sideButtonError: {
    borderColor: COLORS.error,
  },
  sideText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.warmDark,
  },
  sideTextActive: {
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
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
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

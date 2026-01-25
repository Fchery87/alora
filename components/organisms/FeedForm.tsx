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
  typeButtonError: {
    borderColor: "#ef4444",
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
  sideButtonError: {
    borderColor: "#ef4444",
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
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
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

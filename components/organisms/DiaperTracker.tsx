import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useCreateDiaper } from "@/hooks/queries/useDiapers";
import {
  validateDiaper,
  type DiaperFormData,
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

type DiaperType = "wet" | "solid" | "mixed";
type DiaperColor = "yellow" | "orange" | "green" | "brown" | "red" | null;

interface DiaperTrackerProps {
  babyId: string;
  onSuccess?: () => void;
}

export function DiaperTracker({ babyId, onSuccess }: DiaperTrackerProps) {
  const [type, setType] = useState<DiaperType>("wet");
  const [color, setColor] = useState<DiaperColor>(null);
  const [notes, setNotes] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const createDiaperMutation = useCreateDiaper();

  const diaperTypes: { value: DiaperType; label: string; icon: string }[] = [
    { value: "wet", label: "Wet", icon: "water-outline" },
    { value: "solid", label: "Dirty", icon: "ellipse-outline" },
    { value: "mixed", label: "Mixed", icon: "layers-outline" },
  ];

  const colors: { value: DiaperColor; label: string; color: string }[] = [
    { value: "yellow", label: "Yellow", color: "#fde047" },
    { value: "orange", label: "Orange", color: "orange" },
    { value: "green", label: "Green", color: "#86efac" },
    { value: "brown", label: "Brown", color: "#92400e" },
    { value: "red", label: "Red ⚠️", color: "#ef4444" },
  ];

  // Validate form in real-time
  const validate = () => {
    const formData: Partial<DiaperFormData> = {
      type,
      color: color || undefined,
      notes: notes || undefined,
    };

    const result = validateDiaper(formData);
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
    setTouched({ type: true });

    // Validate
    if (!validate()) {
      toast.error("Validation Error", "Please fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await createDiaperMutation.mutateAsync({
        babyId: babyId as any,
        type,
        color: color || undefined,
        notes: notes || undefined,
        startTime: Date.now(),
      });

      setNotes("");
      setColor(null);
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Diaper Logged",
        "The diaper record has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, { context: "DiaperTracker", type, color });

      toast.error("Failed to Log Diaper", getUserFriendlyMessage(appError));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = () => {
    const formData: Partial<DiaperFormData> = { type };
    const result = validateDiaper(formData);
    return result.isValid;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Log Diaper</Text>

      {/* Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {diaperTypes.map((diaperType) => (
            <TouchableOpacity
              key={diaperType.value}
              style={StyleSheet.flatten([
                styles.typeButton,
                type === diaperType.value && styles.typeButtonActive,
                touched.type &&
                  hasFieldError(
                    validateDiaper({ type: diaperType.value }),
                    "type"
                  ) &&
                  styles.typeButtonError,
              ])}
              onPress={() => {
                setType(diaperType.value);
                handleBlur("type");
              }}
            >
              <Ionicons
                name={diaperType.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={type === diaperType.value ? COLORS.white : COLORS.sage}
              />
              <Text
                style={[
                  styles.typeText,
                  type === diaperType.value && styles.typeTextActive,
                ]}
              >
                {diaperType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {touched.type && validationErrors.type && (
          <Text style={styles.errorText}>{validationErrors.type}</Text>
        )}
      </View>

      {/* Color Selection */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.colorToggle}
          onPress={() => setShowColorPicker(!showColorPicker)}
        >
          <Text style={styles.label}>Color (optional)</Text>
          <Ionicons
            name={showColorPicker ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.sage}
          />
        </TouchableOpacity>

        {showColorPicker && (
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.colorButton, !color && styles.colorButtonActive]}
              onPress={() => setColor(null)}
            >
              <Text style={!color ? styles.colorTextActive : styles.colorText}>
                N/A
              </Text>
            </TouchableOpacity>
            {colors.map((c) => (
              <TouchableOpacity
                key={c.value!}
                style={[
                  styles.colorButton,
                  { backgroundColor: c.color },
                  color === c.value && styles.colorButtonActive,
                ]}
                onPress={() => setColor(c.value)}
              >
                <Text style={styles.colorLabel}>{c.label}</Text>
                {color === c.value && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
          {isSubmitting ? "Logging..." : "Log Diaper"}
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
    borderColor: COLORS.sage,
    backgroundColor: COLORS.sage,
  },
  typeButtonError: {
    borderColor: COLORS.error,
  },
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.sage,
  },
  typeTextActive: {
    color: COLORS.white,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },
  colorToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  colorContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    flexWrap: "wrap",
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.sand,
  },
  colorButtonActive: {
    borderColor: COLORS.warmDark,
  },
  colorLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.warmDark,
  },
  colorText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.warmGray,
  },
  colorTextActive: {
    color: COLORS.warmDark,
    fontWeight: "700",
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.sage,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.sage,
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

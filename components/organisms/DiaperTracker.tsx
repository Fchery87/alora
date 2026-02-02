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
  const createDiaper = createDiaperMutation as unknown as (args: any) => void;

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
      await createDiaper({
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
                color={type === diaperType.value ? "#fff" : "#6366f1"}
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
            color="#6366f1"
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
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
  },
  colorToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    borderColor: "#e5e7eb",
  },
  colorButtonActive: {
    borderColor: "#0f172a",
  },
  colorLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#111827",
  },
  colorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  colorTextActive: {
    color: "#fff",
    fontWeight: "bold",
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

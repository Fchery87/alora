import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  useCreateGrowth,
  useListGrowth,
  GrowthMeasurement,
} from "@/hooks/queries/useGrowth";
import {
  validateGrowth,
  type GrowthFormData,
  hasFieldError,
} from "@/lib/validation";
import { parseError, logError, getUserFriendlyMessage } from "@/lib/errors";
import { useToast } from "@/components/atoms/Toast";

interface GrowthTrackerProps {
  babyId: string;
  onSuccess?: () => void;
}

type MeasurementType = "weight" | "length" | "head_circumference";

export function GrowthTracker({ babyId, onSuccess }: GrowthTrackerProps) {
  const [measurementType, setMeasurementType] =
    useState<MeasurementType>("weight");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("kg");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const createGrowthMutation = useCreateGrowth();
  const createGrowth = createGrowthMutation as unknown as (args: any) => void;

  const measurementTypes: {
    value: MeasurementType;
    label: string;
    icon: string;
    unit: string;
  }[] = [
    { value: "weight", label: "Weight", icon: "scale-outline", unit: "kg" },
    { value: "length", label: "Length", icon: "resize-outline", unit: "cm" },
    {
      value: "head_circumference",
      label: "Head Circ.",
      icon: "ellipse-outline",
      unit: "cm",
    },
  ];

  const currentMeasurement = measurementTypes.find(
    (m) => m.value === measurementType
  );

  // Validate form in real-time
  const validate = () => {
    const formData: Partial<GrowthFormData> = {
      type: measurementType,
      value,
      unit,
      date,
      notes: notes || undefined,
    };

    const result = validateGrowth(formData);
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

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Mark all fields as touched
    setTouched({ type: true, value: true, unit: true, date: true });

    // Validate
    if (!validate()) {
      toast.error("Validation Error", "Please fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const numericValue = parseFloat(value);

      await createGrowth({
        babyId,
        type: measurementType,
        value: numericValue,
        unit: unit || currentMeasurement?.unit || "kg",
        date: new Date(date).toISOString(),
        notes: notes || undefined,
      });

      setValue("");
      setNotes("");
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Measurement Logged",
        "The growth record has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, {
        context: "GrowthTracker",
        measurementType,
        value,
        unit,
        date,
      });

      toast.error(
        "Failed to Log Measurement",
        getUserFriendlyMessage(appError)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = () => {
    const formData: Partial<GrowthFormData> = {
      type: measurementType,
      value,
      unit,
      date,
    };
    const result = validateGrowth(formData);
    return result.isValid;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Growth</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Measurement Type</Text>
        <View style={styles.typeContainer}>
          {measurementTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                measurementType === type.value && styles.typeButtonActive,
              ]}
              onPress={() => {
                setMeasurementType(type.value);
                setUnit(type.unit);
              }}
            >
              <Ionicons
                name={type.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={measurementType === type.value ? "#fff" : "#6366f1"}
              />
              <Text
                style={[
                  styles.typeText,
                  measurementType === type.value && styles.typeTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Value</Text>
        <View style={styles.valueRow}>
          <TextInput
            style={StyleSheet.flatten(
              [
                styles.input,
                styles.valueInput,
                touched.value && validationErrors.value ? styles.inputError : undefined,
              ].filter(Boolean)
            )}
            placeholder={`Enter ${currentMeasurement?.label.toLowerCase()}`}
            value={value}
            onChangeText={(text) => {
              setValue(text);
              if (touched.value) validate();
            }}
            onBlur={() => handleBlur("value")}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <View style={styles.unitContainer}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                unit === currentMeasurement?.unit ? styles.unitButtonActive : undefined,
                touched.unit && validationErrors.unit ? styles.unitButtonError : undefined,
              ].filter(Boolean) as any}
              onPress={() => {
                setUnit(currentMeasurement?.unit || "kg");
                handleBlur("unit");
              }}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === currentMeasurement?.unit && styles.unitTextActive,
                ]}
              >
                {currentMeasurement?.unit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {touched.value && validationErrors.value && (
          <Text style={styles.errorText}>{validationErrors.value}</Text>
        )}
        {touched.unit && validationErrors.unit && (
          <Text style={styles.errorText}>{validationErrors.unit}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={StyleSheet.flatten(
            [
              styles.input,
              touched.date && validationErrors.date ? styles.inputError : undefined,
            ].filter(Boolean)
          )}
          value={date}
          onChangeText={(text) => {
            setDate(text);
            if (touched.date) validate();
          }}
          onBlur={() => handleBlur("date")}
          placeholder="YYYY-MM-DD"
        />
        {touched.date && validationErrors.date && (
          <Text style={styles.errorText}>{validationErrors.date}</Text>
        )}
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
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!isValid() || isSubmitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isValid() || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Logging..." : "Log Measurement"}
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
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  typeTextActive: {
    color: "#ffffff",
  },
  valueRow: {
    flexDirection: "row",
    gap: 12,
  },
  valueInput: {
    flex: 2,
  },
  unitContainer: {
    flex: 1,
  },
  unitButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  unitButtonActive: {
    borderColor: "#6366f1",
    backgroundColor: "#6366f1",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  unitTextActive: {
    color: "#ffffff",
  },
  unitButtonError: {
    borderColor: "#ef4444",
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

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  useCreateGrowth,
  useListGrowth,
  GrowthMeasurement,
} from "@/hooks/queries/useGrowth";

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

  const handleSubmit = async () => {
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        return;
      }

      createGrowth({
        babyId,
        type: measurementType,
        value: numericValue,
        unit: unit || currentMeasurement?.unit || "kg",
        date: new Date(date).toISOString(),
        notes: notes || undefined,
      });

      setValue("");
      setNotes("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to log growth measurement:", error);
    }
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
            style={[styles.input, styles.valueInput]}
            placeholder={`Enter ${currentMeasurement?.label.toLowerCase()}`}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
          />
          <View style={styles.unitContainer}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                unit === currentMeasurement?.unit && styles.unitButtonActive,
              ]}
              onPress={() => setUnit(currentMeasurement?.unit || "kg")}
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
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Log Measurement</Text>
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

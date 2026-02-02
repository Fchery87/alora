import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StyleProp,
  TextStyle,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { validateAppointment as validateAppointmentData } from "@/lib/validation";

export interface AppointmentFormData {
  title: string;
  description?: string;
  type: "pediatrician" | "checkup" | "vaccine" | "wellness" | "custom";
  date: string;
  time: string;
  location?: string;
  notes?: string;
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
}

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AppointmentFormData>;
}

const APPOINTMENT_TYPES = [
  { value: "pediatrician", label: "Pediatrician", icon: "medical" },
  { value: "checkup", label: "Check-up", icon: "checkmark-circle" },
  { value: "vaccine", label: "Vaccine", icon: "shield" },
  { value: "wellness", label: "Wellness", icon: "heart" },
  { value: "custom", label: "Custom", icon: "ellipsis-horizontal" },
] as const;

const REMINDER_OPTIONS = [
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
];

export function AppointmentForm({
  onSubmit,
  onCancel,
  initialData,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: initialData?.title || "",
    type: initialData?.type || "pediatrician",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    notes: initialData?.notes || "",
    reminderEnabled: initialData?.reminderEnabled ?? true,
    reminderMinutesBefore: initialData?.reminderMinutesBefore ?? 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const validation = validateAppointmentData({
      ...formData,
      date: new Date(formData.date).getTime(),
      time: new Date(formData.time).getTime(),
    } as any);

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const updateField = <K extends keyof AppointmentFormData>(
    field: K,
    value: AppointmentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Appointment</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={
          [
            styles.input,
            errors.title ? styles.inputError : null,
          ] as StyleProp<TextStyle>
        }
        placeholder="Appointment title"
        value={formData.title}
        onChangeText={(text) => updateField("title", text)}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeGrid}>
        {APPOINTMENT_TYPES.map((type) => (
          <Pressable
            key={type.value}
            style={[
              styles.typeButton,
              formData.type === type.value && styles.typeButtonActive,
            ]}
            onPress={() => updateField("type", type.value as any)}
          >
            <Ionicons
              name={type.icon as any}
              size={20}
              color={formData.type === type.value ? "#fff" : "#6366f1"}
            />
            <Text
              style={[
                styles.typeButtonText,
                formData.type === type.value && styles.typeButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={
              [
                styles.input,
                errors.date ? styles.inputError : null,
              ] as StyleProp<TextStyle>
            }
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(text) => updateField("date", text)}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <View style={styles.halfWidth}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={
              [
                styles.input,
                errors.time ? styles.inputError : null,
              ] as StyleProp<TextStyle>
            }
            placeholder="HH:MM"
            value={formData.time}
            onChangeText={(text) => updateField("time", text)}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </View>
      </View>

      <Text style={styles.label}>Location (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Clinic or hospital name"
        value={formData.location}
        onChangeText={(text) => updateField("location", text)}
      />

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Additional notes..."
        value={formData.notes}
        onChangeText={(text) => updateField("notes", text)}
        multiline
        numberOfLines={3}
      />

      <View style={styles.reminderSection}>
        <View style={styles.reminderHeader}>
          <Ionicons name="notifications" size={20} color="#6366f1" />
          <Text style={styles.reminderLabel}>Reminder</Text>
          <Pressable
            style={styles.switch}
            onPress={() =>
              updateField("reminderEnabled", !formData.reminderEnabled)
            }
          >
            <View
              style={[
                styles.switchTrack,
                formData.reminderEnabled && styles.switchTrackActive,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  formData.reminderEnabled && styles.switchThumbActive,
                ]}
              />
            </View>
          </Pressable>
        </View>

        {formData.reminderEnabled && (
          <View style={styles.reminderOptions}>
            {REMINDER_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.reminderOption,
                  formData.reminderMinutesBefore === option.value &&
                    styles.reminderOptionActive,
                ]}
                onPress={() =>
                  updateField("reminderMinutesBefore", option.value)
                }
              >
                <Text
                  style={[
                    styles.reminderOptionText,
                    formData.reminderMinutesBefore === option.value &&
                      styles.reminderOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Appointment</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#0f172a",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "transparent",
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  reminderSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reminderLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  switch: {
    width: 48,
    height: 28,
  },
  switchTrack: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: "#6366f1",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  switchThumbActive: {
    marginLeft: 20,
  },
  reminderOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  reminderOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  reminderOptionActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  reminderOptionText: {
    fontSize: 12,
    color: "#64748b",
  },
  reminderOptionTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
  },
});

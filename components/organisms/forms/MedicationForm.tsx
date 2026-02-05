import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { validateMedication as validateMedicationData } from "@/lib/validation";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

// Helper function to safely combine styles
function inputStyle(hasError: boolean): any[] {
  return hasError ? [styles.input, styles.inputError] : [styles.input];
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  type: "prescription" | "otc" | "supplement";
  notes?: string;
  reminderEnabled?: boolean;
  reminderTimes?: string[];
}

interface MedicationFormProps {
  onSubmit: (data: MedicationFormData) => void;
  onCancel: () => void;
  initialData?: Partial<MedicationFormData>;
}

const MEDICATION_TYPES = [
  { value: "prescription", label: "Prescription", icon: "medical" },
  { value: "otc", label: "Over-the-Counter", icon: "cube" },
  { value: "supplement", label: "Supplement", icon: "leaf" },
] as const;

const FREQUENCY_OPTIONS = [
  { value: "once", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "twice", label: "Twice daily" },
  { value: "weekly", label: "Weekly" },
  { value: "asNeeded", label: "As needed" },
];

export function MedicationForm({
  onSubmit,
  onCancel,
  initialData,
}: MedicationFormProps) {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: initialData?.name || "",
    dosage: initialData?.dosage || "",
    frequency: initialData?.frequency || "daily",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    type: initialData?.type || "prescription",
    notes: initialData?.notes || "",
    reminderEnabled: initialData?.reminderEnabled ?? true,
    reminderTimes: initialData?.reminderTimes || ["08:00"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const validation = validateMedicationData({
      ...formData,
      startDate: new Date(formData.startDate).getTime(),
      endDate: formData.endDate
        ? new Date(formData.endDate).getTime()
        : undefined,
    } as any);

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const updateField = <K extends keyof MedicationFormData>(
    field: K,
    value: MedicationFormData[K]
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
      <Text style={styles.title}>Log Medication</Text>

      <Text style={styles.label}>Medication Name</Text>
      <TextInput
        style={inputStyle(Boolean(errors.name))}
        placeholder="e.g., Amoxicillin"
        value={formData.name}
        onChangeText={(text) => updateField("name", text)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeGrid}>
        {MEDICATION_TYPES.map((type) => (
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
              size={18}
              color={
                formData.type === type.value
                  ? THEME_TEXT.primaryInverse
                  : COLORS.sage
              }
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

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={inputStyle(Boolean(errors.dosage))}
            placeholder="e.g., 5ml"
            value={formData.dosage}
            onChangeText={(text) => updateField("dosage", text)}
          />
          {errors.dosage && (
            <Text style={styles.errorText}>{errors.dosage}</Text>
          )}
        </View>

        <View style={styles.halfWidth}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.pickerTrigger}>
            <Text style={styles.pickerText}>
              {
                FREQUENCY_OPTIONS.find((f) => f.value === formData.frequency)
                  ?.label
              }
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748b" />
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={inputStyle(Boolean(errors.startDate))}
            placeholder="YYYY-MM-DD"
            value={formData.startDate}
            onChangeText={(text) => updateField("startDate", text)}
          />
          {errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate}</Text>
          )}
        </View>

        <View style={styles.halfWidth}>
          <Text style={styles.label}>End Date (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.endDate}
            onChangeText={(text) => updateField("endDate", text)}
          />
        </View>
      </View>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Additional instructions..."
        value={formData.notes}
        onChangeText={(text) => updateField("notes", text)}
        multiline
        numberOfLines={3}
      />

      <View style={styles.reminderSection}>
        <View style={styles.reminderHeader}>
          <Ionicons name="notifications" size={20} color={COLORS.sage} />
          <Text style={styles.reminderLabel}>Reminders</Text>
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
          <View style={styles.reminderTimes}>
            <Text style={styles.reminderSubtitle}>Reminder times</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                placeholder="08:00"
                value={formData.reminderTimes?.[0] || ""}
                onChangeText={(text) => updateField("reminderTimes", [text])}
              />
              <Pressable style={styles.addTimeButton}>
                <Ionicons
                  name="add"
                  size={20}
                  color={THEME_TEXT.primaryInverse}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Medication</Text>
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
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    padding: 20,
  },
  title: {
    ...TYPOGRAPHY.headings.h2,
    color: THEME_TEXT.primary,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: "CareJournalUIMedium",
    color: THEME_TEXT.secondary,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: THEME_TEXT.primary,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontFamily: "CareJournalUI",
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
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  typeButtonText: {
    fontSize: 13,
    fontFamily: "CareJournalUIMedium",
    color: THEME_TEXT.secondary,
  },
  typeButtonTextActive: {
    color: THEME_TEXT.primaryInverse,
  },
  pickerTrigger: {
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: THEME_TEXT.primary,
  },
  reminderSection: {
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.sm,
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reminderLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "CareJournalHeadingMedium",
    color: THEME_TEXT.primary,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: THEME_TEXT.tertiary,
    fontFamily: "CareJournalUI",
    marginTop: 12,
    marginBottom: 8,
  },
  switch: {
    width: 48,
    height: 28,
  },
  switchTrack: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: BACKGROUND.tertiary,
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: COLORS.sage,
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
  reminderTimes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BACKGROUND.tertiary,
  },
  timeInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: THEME_TEXT.primary,
  },
  addTimeButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.sage,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  submitButton: {
    backgroundColor: COLORS.terracotta,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    ...SHADOWS.sm,
  },
  submitButtonText: {
    ...TYPOGRAPHY.button,
    color: THEME_TEXT.primaryInverse,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: THEME_TEXT.secondary,
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
  },
});

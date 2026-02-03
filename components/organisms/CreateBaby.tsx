import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { validateBaby, type BabyFormData } from "@/lib/validation";
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

interface CreateBabyProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Gender = "male" | "female" | "other";

/**
 * Create baby form component
 * Allows users to add a new baby with name, birth date, gender, and optional photo
 */
export function CreateBaby({ visible, onClose, onSuccess }: CreateBabyProps) {
  const createBaby = useMutation(api.functions.babies.index.create);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [gender, setGender] = useState<Gender>("male");
  const [photoUrl, setPhotoUrl] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const validate = () => {
    const formData: Partial<BabyFormData> = {
      name,
      birthDate,
      gender,
      photoUrl: photoUrl || undefined,
    };

    const result = validateBaby(formData);
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

    // Mark all fields as touched
    setTouched({ name: true, birthDate: true, gender: true });

    // Validate
    if (!validate()) {
      toast.error("Validation Error", "Please fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert date string to timestamp
      const birthDateTimestamp = new Date(birthDate).getTime();

      // Create baby via Convex mutation
      await createBaby({
        name: name.trim(),
        birthDate: birthDateTimestamp,
        gender,
        photoUrl: photoUrl || undefined,
      });

      // Reset form
      setName("");
      setBirthDate(new Date().toISOString().split("T")[0]);
      setGender("male");
      setPhotoUrl("");
      setTouched({});
      setValidationErrors({});

      // Close modal and call success callback
      onClose();
      toast.success("Baby Created", "The baby has been added successfully");
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, { context: "CreateBaby", name, gender });

      toast.error("Failed to Create Baby", getUserFriendlyMessage(appError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = () => {
    const formData: Partial<BabyFormData> = {
      name,
      birthDate,
      gender,
    };
    const result = validateBaby(formData);
    return result.isValid;
  };

  const genderOptions: {
    value: Gender;
    label: string;
    icon: string;
    color: string;
  }[] = [
    { value: "male", label: "Boy", icon: "male-outline", color: COLORS.sage },
    {
      value: "female",
      label: "Girl",
      icon: "female-outline",
      color: COLORS.terracotta,
    },
    {
      value: "other",
      label: "Other",
      icon: "help-circle-outline",
      color: COLORS.gold,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Baby</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.warmDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {/* Photo Upload Section */}
            <View style={styles.photoSection}>
              <View style={styles.photoPreview}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={styles.photoImage} />
                ) : (
                  <Ionicons
                    name="camera-outline"
                    size={32}
                    color={COLORS.stone}
                  />
                )}
              </View>
              <TouchableOpacity style={styles.photoButton}>
                <Text style={styles.photoButtonText}>
                  {photoUrl ? "Change Photo" : "Add Photo"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.photoHint}>Photo upload coming soon</Text>
            </View>

            {/* Name Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Baby's Name</Text>
              <TextInput
                style={StyleSheet.flatten(
                  [
                    styles.input,
                    touched.name && validationErrors.name
                      ? styles.inputError
                      : undefined,
                  ].filter(Boolean)
                )}
                placeholder="Enter name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (touched.name) validate();
                }}
                onBlur={() => handleBlur("name")}
                placeholderTextColor={COLORS.stone}
              />
              {touched.name && validationErrors.name && (
                <Text style={styles.errorText}>{validationErrors.name}</Text>
              )}
            </View>

            {/* Birth Date Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Birth Date</Text>
              <TextInput
                style={StyleSheet.flatten(
                  [
                    styles.input,
                    touched.birthDate && validationErrors.birthDate
                      ? styles.inputError
                      : undefined,
                  ].filter(Boolean)
                )}
                placeholder="YYYY-MM-DD"
                value={birthDate}
                onChangeText={(text) => {
                  setBirthDate(text);
                  if (touched.birthDate) validate();
                }}
                onBlur={() => handleBlur("birthDate")}
                placeholderTextColor={COLORS.stone}
              />
              {touched.birthDate && validationErrors.birthDate && (
                <Text style={styles.errorText}>
                  {validationErrors.birthDate}
                </Text>
              )}
            </View>

            {/* Gender Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderGrid}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={StyleSheet.flatten([
                      styles.genderCard,
                      gender === option.value && styles.genderCardSelected,
                      touched.gender &&
                        validationErrors.gender &&
                        styles.genderCardError,
                      gender === option.value
                        ? { borderColor: option.color }
                        : {},
                    ])}
                    onPress={() => {
                      setGender(option.value);
                      handleBlur("gender");
                    }}
                  >
                    <Ionicons
                      name={option.icon as keyof typeof Ionicons.glyphMap}
                      size={32}
                      color={
                        gender === option.value ? option.color : COLORS.stone
                      }
                    />
                    <Text
                      style={[
                        styles.genderLabel,
                        gender === option.value && { color: option.color },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.gender && validationErrors.gender && (
                <Text style={styles.errorText}>{validationErrors.gender}</Text>
              )}
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
                {isSubmitting ? "Creating..." : "Create Baby"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(45, 42, 38, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.warmDark,
  },
  form: {
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.sand,
    borderWidth: 2,
    borderColor: COLORS.sand,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoButton: {
    backgroundColor: COLORS.sand,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmGray,
  },
  photoHint: {
    fontSize: 12,
    color: COLORS.stone,
    marginTop: 6,
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
  input: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.sand,
    color: COLORS.warmDark,
  },
  genderGrid: {
    flexDirection: "row",
    gap: 12,
  },
  genderCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.sand,
  },
  genderCardSelected: {
    backgroundColor: COLORS.warmLight,
  },
  genderCardError: {
    borderColor: COLORS.error,
  },
  genderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.stone,
    marginTop: 8,
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

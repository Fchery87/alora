import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useCreateSleep, useUpdateSleep } from "@/hooks/queries/useSleep";
import {
  validateSleep,
  type SleepFormData,
  hasFieldError,
} from "@/lib/validation";
import { parseError, logError, getUserFriendlyMessage } from "@/lib/errors";
import { useToast } from "@/components/atoms/Toast";

type SleepType = "nap" | "night" | "day";

interface SleepTrackerProps {
  babyId: string;
  existingSleepId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SleepTracker({
  babyId,
  existingSleepId,
  onSuccess,
  onCancel,
}: SleepTrackerProps) {
  const [type, setType] = useState<SleepType>("nap");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const createSleepMutation = useCreateSleep();
  const createSleep = createSleepMutation as unknown as (args: any) => void;
  const updateSleepMutation = useUpdateSleep();
  const updateSleep = updateSleepMutation as unknown as (args: any) => void;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerMode && !endTime) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerMode, endTime]);

  const sleepTypes: { value: SleepType; label: string; icon: string }[] = [
    { value: "nap", label: "Nap", icon: "moon-outline" },
    { value: "night", label: "Night", icon: "moon" },
    { value: "day", label: "Daytime", icon: "sunny-outline" },
  ];

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleStartTimer = () => {
    setIsTimerMode(true);
    setStartTime(new Date());
    setElapsedSeconds(0);
  };

  const handleStopTimer = () => {
    setEndTime(new Date());
    setIsTimerMode(false);
  };

  // Validate form in real-time
  const validate = () => {
    const duration = endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
      : elapsedSeconds
        ? Math.floor(elapsedSeconds / 60)
        : undefined;

    const formData: Partial<SleepFormData> = {
      type,
      startTime,
      endTime,
      duration,
    };

    const result = validateSleep(formData);
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
    setTouched({ type: true, startTime: true });

    // Validate
    if (!validate()) {
      toast.error("Validation Error", "Please fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const duration = endTime
        ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
        : elapsedSeconds
          ? Math.floor(elapsedSeconds / 60)
          : undefined;

      if (existingSleepId) {
        await updateSleep({
          id: existingSleepId as any,
          data: {
            startTime: startTime.getTime(),
            endTime: endTime?.getTime(),
            duration,
          },
        });
      } else {
        await createSleep({
          babyId: babyId as any,
          type,
          startTime: startTime.getTime(),
          endTime: endTime?.getTime(),
          duration,
        });
      }

      setEndTime(null);
      setElapsedSeconds(0);
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Sleep Logged",
        "The sleep record has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, { context: "SleepTracker", type, existingSleepId });

      toast.error("Failed to Log Sleep", getUserFriendlyMessage(appError));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = () => {
    const duration = endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
      : undefined;

    const formData: Partial<SleepFormData> = {
      type,
      startTime,
      endTime,
      duration,
    };
    const result = validateSleep(formData);
    return result.isValid;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        {existingSleepId ? "Edit Sleep" : "Log Sleep"}
      </Text>

      {/* Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {sleepTypes.map((sleepType) => (
            <TouchableOpacity
              key={sleepType.value}
              style={StyleSheet.flatten([
                styles.typeButton,
                type === sleepType.value && styles.typeButtonActive,
                touched.type &&
                  hasFieldError(
                    validateSleep({ type: sleepType.value, startTime }),
                    "type"
                  ) &&
                  styles.typeButtonError,
              ])}
              onPress={() => {
                setType(sleepType.value);
                handleBlur("type");
              }}
            >
              <Ionicons
                name={sleepType.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={type === sleepType.value ? "#fff" : "#6366f1"}
              />
              <Text
                style={[
                  styles.typeText,
                  type === sleepType.value && styles.typeTextActive,
                ]}
              >
                {sleepType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {touched.type && validationErrors.type && (
          <Text style={styles.errorText}>{validationErrors.type}</Text>
        )}
      </View>

      {/* Timer */}
      <View style={styles.section}>
        <Text style={styles.label}>Duration</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatDuration(elapsedSeconds)}</Text>
          <View style={styles.timerButtons}>
            {!isTimerMode && !endTime ? (
              <TouchableOpacity
                style={styles.timerButton}
                onPress={handleStartTimer}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.timerButtonText}>Start</Text>
              </TouchableOpacity>
            ) : isTimerMode ? (
              <TouchableOpacity
                style={styles.timerButton}
                onPress={handleStopTimer}
              >
                <Ionicons name="square" size={20} color="#fff" />
                <Text style={styles.timerButtonText}>Stop</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {touched.startTime && validationErrors.startTime && (
          <Text style={styles.errorText}>{validationErrors.startTime}</Text>
        )}
        {touched.startTime && validationErrors.endTime && (
          <Text style={styles.errorText}>{validationErrors.endTime}</Text>
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
          {isSubmitting
            ? "Saving..."
            : existingSleepId
              ? "Update Sleep"
              : "Log Sleep"}
        </Text>
      </TouchableOpacity>

      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
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
  timerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  timerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  timerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
  },
});

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
  const updateSleepMutation = useUpdateSleep();

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
      ? endTime.getTime() - startTime.getTime()
      : elapsedSeconds
        ? elapsedSeconds * 1000
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
        ? endTime.getTime() - startTime.getTime()
        : elapsedSeconds
          ? elapsedSeconds * 1000
          : undefined;

      if (existingSleepId) {
        await updateSleepMutation.mutateAsync({
          id: existingSleepId as any,
          data: {
            startTime: startTime.getTime(),
            endTime: endTime?.getTime(),
            duration,
          },
        });
      } else {
        await createSleepMutation.mutateAsync({
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
                color={type === sleepType.value ? COLORS.white : COLORS.moss}
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
                <Ionicons name="play" size={20} color={COLORS.white} />
                <Text style={styles.timerButtonText}>Start</Text>
              </TouchableOpacity>
            ) : isTimerMode ? (
              <TouchableOpacity
                style={styles.timerButton}
                onPress={handleStopTimer}
              >
                <Ionicons name="square" size={20} color={COLORS.white} />
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
    borderColor: COLORS.moss,
    backgroundColor: COLORS.moss,
  },
  typeButtonError: {
    borderColor: COLORS.error,
  },
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.moss,
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
  timerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.warmDark,
    marginBottom: 16,
    fontVariant: ["tabular-nums"],
  },
  timerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.moss,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.moss,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  timerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.moss,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.moss,
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
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: COLORS.warmGray,
    fontSize: 16,
    fontWeight: "500",
  },
});

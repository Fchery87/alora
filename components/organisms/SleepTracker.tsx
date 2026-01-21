import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useCreateSleep, useUpdateSleep } from "@/hooks/queries/useSleep";

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

  const handleSubmit = async () => {
    try {
      const duration = endTime
        ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
        : elapsedSeconds
          ? Math.floor(elapsedSeconds / 60)
          : undefined;

      if (existingSleepId) {
        updateSleep({
          id: existingSleepId as any,
          data: {
            startTime: startTime.getTime(),
            endTime: endTime?.getTime(),
            duration,
          },
        });
      } else {
        createSleep({
          babyId: babyId as any,
          type,
          startTime: startTime.getTime(),
          endTime: endTime?.getTime(),
          duration,
        });
      }

      setEndTime(null);
      setElapsedSeconds(0);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to log sleep:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {existingSleepId ? "Edit Sleep" : "Log Sleep"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {sleepTypes.map((sleepType) => (
            <TouchableOpacity
              key={sleepType.value}
              style={[
                styles.typeButton,
                type === sleepType.value && styles.typeButtonActive,
              ]}
              onPress={() => setType(sleepType.value)}
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
      </View>

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
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {existingSleepId ? "Update Sleep" : "Log Sleep"}
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
  typeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  typeTextActive: {
    color: "#ffffff",
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

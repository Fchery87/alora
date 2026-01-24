import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SleepCardProps {
  sleep: {
    id: string;
    type: string;
    duration?: number;
    quality?: string;
    notes?: string;
    startTime?: string | number;
    endTime?: string | number;
  };
  onPress?: () => void;
}

const SLEEP_COLORS: Record<string, string> = {
  nap: "#a78bfa",
  night: "#1e293b",
  day: "#fbbf24",
};

const SLEEP_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  nap: "moon-outline",
  night: "bed-outline",
  day: "sunny-outline",
};

const QUALITY_COLORS: Record<string, string> = {
  awake: "#94a3b8",
  drowsy: "#fbbf24",
  sleeping: "#3b82f6",
  deep: "#1e40af",
};

export function SleepCard({ sleep, onPress }: SleepCardProps) {
  const testId = sleep.id ? sleep.id.replace(/^sleep-/, "") : "unknown";
  const color = SLEEP_COLORS[sleep.type] || "#6366f1";
  const icon = SLEEP_ICONS[sleep.type] || "bed-outline";

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return "";

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (timestamp: string | number | undefined) => {
    if (!timestamp) return "";

    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <TouchableOpacity
      testID={`sleep-card-${testId}`}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.title}>{sleep.type}</Text>
        {sleep.duration && (
          <Text style={styles.duration}>{formatDuration(sleep.duration)}</Text>
        )}
      </View>

      <View style={styles.details}>
        {sleep.startTime && (
          <Text style={styles.time}>{formatTime(sleep.startTime)}</Text>
        )}

        {sleep.quality && (
          <View style={[styles.qualityBadge, { backgroundColor: `${QUALITY_COLORS[sleep.quality]}20` }]}>
            <Text style={styles.qualityText}>{sleep.quality}</Text>
          </View>
        )}
      </View>

      {sleep.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {sleep.notes}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    textTransform: "capitalize",
    flex: 1,
  },
  duration: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  details: {
    flexDirection: "row",
    gap: 8,
  },
  time: {
    fontSize: 13,
    color: "#64748b",
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6366f1",
    textTransform: "capitalize",
  },
  notes: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});

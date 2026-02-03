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
  nap: "#6B7A6B", // moss
  night: "#2D2A26", // warm-dark
  day: "#D4A574", // terracotta
};

const SLEEP_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  nap: "moon-outline",
  night: "bed-outline",
  day: "sunny-outline",
};

const QUALITY_COLORS: Record<string, string> = {
  awake: "#9B8B7A",
  drowsy: "#C9A227", // gold
  sleeping: "#6B7A6B", // moss
  deep: "#5D4E37", // deep earth
};

const QUALITY_BG_COLORS: Record<string, string> = {
  awake: "rgba(155, 139, 122, 0.15)",
  drowsy: "rgba(201, 162, 39, 0.15)",
  sleeping: "rgba(107, 122, 107, 0.15)",
  deep: "rgba(93, 78, 55, 0.15)",
};

export function SleepCard({ sleep, onPress }: SleepCardProps) {
  const testId = sleep.id ? sleep.id.replace(/^sleep-/, "") : "unknown";
  const color = SLEEP_COLORS[sleep.type] || "#6B7A6B";
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

  const qualityColor = sleep.quality ? QUALITY_COLORS[sleep.quality] : null;
  const qualityBgColor = sleep.quality
    ? QUALITY_BG_COLORS[sleep.quality]
    : null;

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
          <View
            style={[
              styles.qualityBadge,
              {
                backgroundColor: qualityBgColor || "rgba(107, 122, 107, 0.15)",
              },
            ]}
          >
            <Text
              style={[styles.qualityText, { color: qualityColor || "#6B7A6B" }]}
            >
              {sleep.quality}
            </Text>
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
    backgroundColor: "#FFFBF7", // warm cream
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2A26", // warm-dark
    textTransform: "capitalize",
    flex: 1,
  },
  duration: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6560", // warm-gray
  },
  details: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  time: {
    fontSize: 13,
    color: "#6B6560",
  },
  qualityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qualityText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  notes: {
    fontSize: 13,
    color: "#6B6560",
    lineHeight: 18,
  },
});

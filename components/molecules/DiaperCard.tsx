import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DiaperCardProps {
  diaper: {
    id: string;
    type: string;
    color?: string;
    notes?: string;
    timestamp?: string | number;
  };
  onPress?: () => void;
}

const DIAPER_COLORS: Record<string, string> = {
  yellow: "#fbbf24",
  orange: "#f97316",
  green: "#22c55e",
  brown: "#a52a2a",
  red: "#ef4444",
};

const DIAPER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wet: "water-outline",
  solid: "snow-outline",
  both: "layers-outline",
  mixed: "copy-outline",
};

export function DiaperCard({ diaper, onPress }: DiaperCardProps) {
  const testId = diaper.id ? diaper.id.replace(/^diaper-/, "") : "unknown";
  const color = diaper.color ? DIAPER_COLORS[diaper.color] : "#6366f1";
  const icon = DIAPER_ICONS[diaper.type] || "list-outline";

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
      testID={`diaper-card-${testId}`}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.title}>{diaper.type}</Text>
        {diaper.timestamp && (
          <Text style={styles.time}>{formatTime(diaper.timestamp)}</Text>
        )}
      </View>

      {diaper.color && (
        <View style={styles.colorBadge}>
          <Text style={styles.colorText}>{diaper.color}</Text>
        </View>
      )}

      {diaper.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {diaper.notes}
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
  time: {
    fontSize: 12,
    color: "#64748b",
  },
  colorBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  colorText: {
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

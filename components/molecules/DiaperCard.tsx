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
  yellow: "#E4B453",
  orange: "#D4874C",
  green: "#8B9A7D", // sage
  brown: "#7A5A3F",
  red: "#C17A5C", // clay
};

const DIAPER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wet: "water-outline",
  solid: "snow-outline",
  both: "layers-outline",
  mixed: "copy-outline",
};

export function DiaperCard({ diaper, onPress }: DiaperCardProps) {
  const testId = diaper.id ? diaper.id.replace(/^diaper-/, "") : "unknown";
  const diaperColor = diaper.color ? DIAPER_COLORS[diaper.color] : "#8B9A7D"; // sage as default
  const icon = DIAPER_ICONS[diaper.type] || "water-outline";
  const sage = "#8B9A7D";

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
        <View style={[styles.iconContainer, { backgroundColor: `${sage}20` }]}>
          <Ionicons name={icon} size={20} color={sage} />
        </View>
        <Text style={styles.title}>{diaper.type}</Text>
        {diaper.timestamp && (
          <Text style={styles.time}>{formatTime(diaper.timestamp)}</Text>
        )}
      </View>

      {diaper.color && (
        <View style={styles.colorBadge}>
          <View style={[styles.colorDot, { backgroundColor: diaperColor }]} />
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
  time: {
    fontSize: 12,
    color: "#6B6560",
  },
  colorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(139, 154, 125, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  colorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7A5F",
    textTransform: "capitalize",
  },
  notes: {
    fontSize: 13,
    color: "#6B6560",
    lineHeight: 18,
  },
});

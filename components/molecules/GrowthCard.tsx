import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GrowthCardProps {
  growth: {
    id: string;
    type: string;
    value: number;
    unit: string;
    date: string;
    percentile?: number;
    notes?: string;
  };
  onPress?: () => void;
}

const GROWTH_COLORS: Record<string, string> = {
  weight: "#22c55e",
  length: "#3b82f6",
  head_circumference: "#8b5cf6",
};

const GROWTH_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  weight: "scale-outline",
  length: "resize-outline",
  head_circumference: "medical-outline",
};

const GROWTH_LABELS: Record<string, string> = {
  weight: "Weight",
  length: "Length",
  head_circumference: "Head Circ.",
};

export function GrowthCard({ growth, onPress }: GrowthCardProps) {
  const testId = growth.id ? growth.id.replace(/^growth-/, "") : "unknown";
  const color = GROWTH_COLORS[growth.type] || "#6366f1";
  const icon = GROWTH_ICONS[growth.type] || "scale-outline";
  const label = GROWTH_LABELS[growth.type] || growth.type;

  return (
    <TouchableOpacity
      testID={`growth-card-${testId}`}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.title}>{label}</Text>
        {growth.percentile && (
          <View style={styles.percentileBadge}>
            <Text style={styles.percentileText}>{growth.percentile}th</Text>
          </View>
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{growth.value} {growth.unit}</Text>
        <Text style={styles.date}>{growth.date}</Text>
      </View>

      {growth.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {growth.notes}
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
  percentileBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  percentileText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e40af",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  date: {
    fontSize: 13,
    color: "#64748b",
  },
  notes: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});

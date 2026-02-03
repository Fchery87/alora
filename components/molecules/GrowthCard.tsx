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
  weight: "#C9A227", // gold
  length: "#C17A5C", // clay
  head_circumference: "#6B7A6B", // moss
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

const PERCENTILE_COLORS: Record<string, string> = {
  high: "#C9A227",
  normal: "#8B9A7D",
  low: "#C17A5C",
};

export function GrowthCard({ growth, onPress }: GrowthCardProps) {
  const testId = growth.id ? growth.id.replace(/^growth-/, "") : "unknown";
  const color = GROWTH_COLORS[growth.type] || "#C9A227";
  const icon = GROWTH_ICONS[growth.type] || "scale-outline";
  const label = GROWTH_LABELS[growth.type] || growth.type;

  const getPercentileColor = (percentile: number | undefined) => {
    if (!percentile) return "#8B9A7D";
    if (percentile >= 85) return PERCENTILE_COLORS.high;
    if (percentile <= 15) return PERCENTILE_COLORS.low;
    return PERCENTILE_COLORS.normal;
  };

  const percentileColor = getPercentileColor(growth.percentile);

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
          <View
            style={[
              styles.percentileBadge,
              { backgroundColor: `${percentileColor}20` },
            ]}
          >
            <Text style={[styles.percentileText, { color: percentileColor }]}>
              {growth.percentile}th
            </Text>
          </View>
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>
          {growth.value} <Text style={styles.unit}>{growth.unit}</Text>
        </Text>
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
  percentileBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentileText: {
    fontSize: 12,
    fontWeight: "600",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  value: {
    fontSize: 26,
    fontWeight: "700",
  },
  unit: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B6560",
  },
  date: {
    fontSize: 13,
    color: "#6B6560",
  },
  notes: {
    fontSize: 13,
    color: "#6B6560",
    lineHeight: 18,
  },
});

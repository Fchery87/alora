import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { RADIUS, SHADOWS, TEXT, COLORS } from "@/lib/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: string;
  variant?: "primary" | "secondary" | "accent" | "calm";
  onPress?: () => void;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  variant = "primary",
  onPress,
  delay = 0,
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return COLORS.success;
      case "down":
        return COLORS.danger;
      default:
        return TEXT.tertiary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  const content = (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        dampingRatio: 0.8,
        stiffness: 150,
      }}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <GradientIcon name={icon} variant={variant} size={20} />
          {trend && trendValue && (
            <View
              style={[
                styles.trendBadge,
                { backgroundColor: `${getTrendColor()}20` },
              ]}
            >
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {getTrendIcon()} {trendValue}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </MotiView>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  trendText: {
    fontFamily: "OutfitMedium",
    fontSize: 11,
  },
  content: {
    gap: 4,
  },
  value: {
    fontFamily: "CrimsonProBold",
    fontSize: 28,
    color: TEXT.primary,
  },
  title: {
    fontFamily: "OutfitMedium",
    fontSize: 12,
    color: TEXT.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: "DMSans",
    fontSize: 12,
    color: TEXT.tertiary,
    marginTop: 2,
  },
});

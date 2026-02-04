import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RADIUS, SHADOWS, TEXT } from "@/lib/theme";
import { GRADIENTS } from "@/lib/theme";

interface QuickActionButtonProps {
  label: string;
  icon: string;
  variant?: "primary" | "secondary" | "accent" | "calm";
  onPress: () => void;
  delay?: number;
}

export function QuickActionButton({
  label,
  icon,
  variant = "primary",
  onPress,
  delay = 0,
}: QuickActionButtonProps) {
  const gradientColors = React.useMemo((): [string, string] => {
    switch (variant) {
      case "primary":
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
      case "secondary":
        return [GRADIENTS.secondary.start, GRADIENTS.secondary.end];
      case "accent":
        return [GRADIENTS.accent.start, GRADIENTS.accent.end];
      case "calm":
        return [GRADIENTS.calm.start, GRADIENTS.calm.end];
      default:
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
    }
  }, [variant]);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        dampingRatio: 0.6,
        stiffness: 180,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.container}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={28} color="#ffffff" />
          </View>
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 80,
  },
  gradient: {
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "OutfitSemiBold",
    fontSize: 13,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

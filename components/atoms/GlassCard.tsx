import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GRADIENTS, SHADOWS, RADIUS, GLASS, BACKGROUND } from "@/lib/theme";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "calm" | "warm";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  variant = "default",
  size = "md",
  style,
  animated = true,
  delay = 0,
}: GlassCardProps) {
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
      case "warm":
        return ["#D4A574", "#E8DED1"];
      default:
        return [BACKGROUND.card, BACKGROUND.secondary];
    }
  }, [variant]);

  const animationStyle = animated
    ? {
        from: { opacity: 0, scale: 0.95, translateY: 10 },
        animate: { opacity: 1, scale: 1, translateY: 0 },
        transition: {
          delay,
          dampingRatio: 0.8,
          stiffness: 150,
        },
      }
    : {};

  const sizeStyles = React.useMemo(() => {
    switch (size) {
      case "sm":
        return { padding: 12, borderRadius: RADIUS.sm };
      case "lg":
        return { padding: 24, borderRadius: RADIUS.xl };
      default:
        return { padding: 16, borderRadius: RADIUS.lg };
    }
  }, [size]);

  return (
    <View style={[styles.container, style]}>
      {animated ? (
        <MotiView
          {...animationStyle}
          style={[
            styles.card,
            sizeStyles,
            variant !== "default" ? styles.gradientCard : styles.creamCard,
          ]}
        >
          {variant !== "default" && (
            <LinearGradient
              colors={gradientColors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          <View
            style={[
              styles.glassOverlay,
              variant === "default" ? styles.creamGlass : styles.tintedGlass,
            ]}
          >
            {children}
          </View>
        </MotiView>
      ) : (
        <View
          style={[
            styles.card,
            sizeStyles,
            variant !== "default" ? styles.gradientCard : styles.creamCard,
          ]}
        >
          {variant !== "default" && (
            <LinearGradient
              colors={gradientColors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          <View
            style={[
              styles.glassOverlay,
              variant === "default" ? styles.creamGlass : styles.tintedGlass,
            ]}
          >
            {children}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  card: {
    ...SHADOWS.md,
    position: "relative",
    overflow: "hidden",
  },
  gradientCard: {
    backgroundColor: "transparent",
  },
  creamCard: {
    backgroundColor: BACKGROUND.card,
  },
  glassOverlay: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  creamGlass: {
    backgroundColor: GLASS.light.background,
  },
  tintedGlass: {
    backgroundColor: "rgba(250, 247, 242, 0.85)",
  },
  absoluteFill: {
    position: "absolute" as "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

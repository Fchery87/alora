import React from "react";
import { View, StyleSheet, ViewStyle, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GRADIENTS, SHADOWS, RADIUS } from "@/lib/theme";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "calm";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  variant = "default",
  size = "md",
  style,
  onPress,
  animated = true,
  delay = 0,
}: GlassCardProps) {
  const gradientColors: readonly [ColorValue, ColorValue] =
    React.useMemo(() => {
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
          return ["#ffffff", "#f8fafc"] as const;
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
            variant !== "default" ? styles.gradientCard : styles.whiteCard,
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
              variant === "default" ? styles.whiteGlass : styles.tintedGlass,
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
            variant !== "default" ? styles.gradientCard : styles.whiteCard,
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
              variant === "default" ? styles.whiteGlass : styles.tintedGlass,
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
  whiteCard: {
    backgroundColor: "#ffffff",
  },
  glassOverlay: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  whiteGlass: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  tintedGlass: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  absoluteFill: {
    position: "absolute" as "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GRADIENTS, RADIUS } from "@/lib/theme";
import { useTheme } from "@/components/providers/ThemeProvider";

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
  const { theme } = useTheme();

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
        return [theme.background.card, theme.background.secondary];
    }
  }, [variant, theme]);

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

  const dynamicStyles = React.useMemo(
    () => ({
      card: {
        ...theme.shadows.md,
      },
      creamCard: {
        backgroundColor: theme.background.card,
      },
      glassOverlay: {
        borderColor: theme.glass.border,
      },
      creamGlass: {
        backgroundColor: theme.glass.background,
      },
      tintedGlass: {
        backgroundColor:
          theme.mode === "dark"
            ? "rgba(45, 42, 38, 0.85)"
            : "rgba(250, 247, 242, 0.85)",
      },
    }),
    [theme]
  );

  const CardWrapper = animated ? MotiView : View;
  const cardWrapperProps = animated ? { ...animationStyle } : {};

  return (
    <View style={[styles.container, style]}>
      <CardWrapper
        {...cardWrapperProps}
        style={[
          styles.card,
          dynamicStyles.card,
          sizeStyles,
          variant !== "default" ? styles.gradientCard : dynamicStyles.creamCard,
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
            dynamicStyles.glassOverlay,
            variant === "default"
              ? dynamicStyles.creamGlass
              : dynamicStyles.tintedGlass,
          ]}
        >
          {children}
        </View>
      </CardWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  card: {
    position: "relative",
    overflow: "hidden",
  },
  gradientCard: {
    backgroundColor: "transparent",
  },
  glassOverlay: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  absoluteFill: {
    position: "absolute" as "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { MotiView } from "moti";
import { RADIUS } from "@/lib/theme";
import { useTheme } from "@/components/providers/ThemeProvider";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "calm" | "warm";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
}

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  const cardTone = React.useMemo(() => {
    const baseBorder =
      theme.mode === "dark" ? theme.glass.border : theme.background.tertiary;

    switch (variant) {
      case "primary":
        return {
          backgroundColor: hexToRgba(theme.colors.terracotta, 0.12),
          borderColor: hexToRgba(theme.colors.terracotta, 0.22),
        };
      case "secondary":
        return {
          backgroundColor: hexToRgba(theme.colors.sage, 0.12),
          borderColor: hexToRgba(theme.colors.sage, 0.22),
        };
      case "accent":
        return {
          backgroundColor: hexToRgba(theme.colors.gold, 0.14),
          borderColor: hexToRgba(theme.colors.gold, 0.24),
        };
      case "calm":
        return {
          backgroundColor: theme.background.secondary,
          borderColor: baseBorder,
        };
      case "warm":
        return {
          backgroundColor: hexToRgba(theme.colors.terracotta, 0.08),
          borderColor: baseBorder,
        };
      case "default":
      default:
        return {
          backgroundColor: theme.background.card,
          borderColor: baseBorder,
        };
    }
  }, [theme, variant]);

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

  const CardWrapper = animated ? MotiView : View;
  const cardWrapperProps = animated ? { ...animationStyle } : {};

  return (
    <CardWrapper
      {...cardWrapperProps}
      style={[
        styles.card,
        theme.shadows.md,
        sizeStyles,
        cardTone,
        style,
        {
          borderWidth: 1,
        },
      ]}
    >
      {children}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
  },
});

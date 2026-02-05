import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { SHADOWS } from "@/lib/theme";
import { useTheme } from "@/components/providers/ThemeProvider";

interface GradientIconProps {
  name: string;
  size?: number;
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "calm";
  style?: any;
  onPress?: () => void;
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

export function GradientIcon({
  name,
  size = 24,
  variant = "primary",
  style,
  onPress,
  animated = true,
  delay = 0,
}: GradientIconProps) {
  const { theme } = useTheme();

  const tone = React.useMemo(() => {
    const alphaWash = theme.mode === "dark" ? 0.18 : 0.12;
    const alphaRing = theme.mode === "dark" ? 0.32 : 0.22;

    switch (variant) {
      case "secondary":
      case "success":
        return {
          ink: theme.colors.sage,
          wash: hexToRgba(theme.colors.sage, alphaWash),
          ring: hexToRgba(theme.colors.sage, alphaRing),
        };
      case "accent":
        return {
          ink: theme.colors.gold,
          wash: hexToRgba(theme.colors.gold, alphaWash + 0.03),
          ring: hexToRgba(theme.colors.gold, alphaRing),
        };
      case "danger":
        return {
          ink: theme.colors.rust,
          wash: hexToRgba(theme.colors.rust, alphaWash),
          ring: hexToRgba(theme.colors.rust, alphaRing),
        };
      case "calm":
        return {
          ink: theme.text.primary,
          wash:
            theme.mode === "dark"
              ? hexToRgba(theme.text.primary, 0.16)
              : theme.background.secondary,
          ring:
            theme.mode === "dark"
              ? theme.glass.border
              : theme.background.tertiary,
        };
      case "primary":
      default:
        return {
          ink: theme.colors.terracotta,
          wash: hexToRgba(theme.colors.terracotta, alphaWash),
          ring: hexToRgba(theme.colors.terracotta, alphaRing),
        };
    }
  }, [theme, variant]);

  const containerStyle = {
    from: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      delay,
      dampingRatio: 0.6,
      stiffness: 180,
    },
  };

  const AnimatedContainer = animated ? MotiView : View;

  const iconContent = (
    <View
      style={[
        styles.iconWrapper,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: (size * 1.8) / 2,
          backgroundColor: tone.wash,
          borderColor: tone.ring,
        },
      ]}
    >
      <Ionicons name={name as any} size={size} color={tone.ink} />
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.container,
          style,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
      >
        {iconContent}
      </Pressable>
    );
  }

  return (
    <AnimatedContainer style={[styles.container, style, containerStyle]}>
      {iconContent}
    </AnimatedContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    ...SHADOWS.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GRADIENTS, SHADOWS } from "@/lib/theme";

interface GradientIconProps {
  name: string;
  size?: number;
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "calm";
  style?: any;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
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
  const gradientColors = React.useMemo((): [string, string] => {
    switch (variant) {
      case "primary":
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
      case "secondary":
        return [GRADIENTS.secondary.start, GRADIENTS.secondary.end];
      case "accent":
        return [GRADIENTS.accent.start, GRADIENTS.accent.end];
      case "success":
        return [GRADIENTS.success.start, GRADIENTS.success.end];
      case "danger":
        return [GRADIENTS.danger.start, GRADIENTS.danger.end];
      case "calm":
        return [GRADIENTS.calm.start, GRADIENTS.calm.end];
      default:
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
    }
  }, [variant]);

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
    <>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.iconWrapper,
          {
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: (size * 1.8) / 2,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              width: size * 1.6,
              height: size * 1.6,
              borderRadius: (size * 1.6) / 2,
            },
          ]}
        >
          <Ionicons name={name as any} size={size} color="#ffffff" />
        </View>
      </LinearGradient>

      {/* Glow effect behind icon */}
      <View
        style={[
          styles.glow,
          {
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: (size * 2.2) / 2,
          },
        ]}
      >
        <View
          style={[
            styles.glowInner,
            {
              backgroundColor: gradientColors[0],
            },
          ]}
        />
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {iconContent}
      </TouchableOpacity>
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
    overflow: "hidden",
    position: "absolute",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    zIndex: -1,
  },
  glowInner: {
    flex: 1,
    borderRadius: 9999,
    opacity: 0.2,
  },
});

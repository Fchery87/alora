import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator as RNActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GRADIENTS, RADIUS, TYPOGRAPHY } from "@/lib/theme";
import { useTheme } from "@/components/providers/ThemeProvider";

interface GradientButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export function GradientButton({
  children,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
}: GradientButtonProps) {
  const { theme } = useTheme();

  const gradientColors = React.useMemo((): [string, string] => {
    switch (variant) {
      case "primary":
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
      case "secondary":
        return [GRADIENTS.secondary.start, GRADIENTS.secondary.end];
      case "accent":
        return [GRADIENTS.accent.start, GRADIENTS.accent.end];
      default:
        return [GRADIENTS.primary.start, GRADIENTS.primary.end];
    }
  }, [variant]);

  const sizeStyles = React.useMemo(() => {
    switch (size) {
      case "sm":
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 };
      case "lg":
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15 };
    }
  }, [size]);

  const isGradient =
    variant === "primary" || variant === "secondary" || variant === "accent";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const dynamicStyles = React.useMemo(
    () => ({
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    }),
    [theme]
  );

  const textColor = isGradient
    ? "#ffffff"
    : isOutline || isGhost
      ? theme.colors.primary
      : theme.text.primary;

  const activityIndicatorColor = isGradient ? "#ffffff" : theme.colors.primary;

  return (
    <MotiView
      from={{ opacity: 0.7, scale: 0.95 }}
      animate={{
        opacity: loading || disabled ? 0.5 : 1,
        scale: loading || disabled ? 0.98 : 1,
      }}
      transition={{ dampingRatio: 0.8, stiffness: 200 }}
      style={style}
    >
      <Pressable
        onPress={onPress}
        disabled={loading || disabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !disabled && !loading && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.container,
            sizeStyles,
            isOutline && dynamicStyles.outline,
            isGhost && dynamicStyles.ghost,
            { borderRadius: RADIUS.md },
          ]}
        >
          {isGradient && (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.md }]}
            />
          )}

          {loading ? (
            <RNActivityIndicator size="small" color={activityIndicatorColor} />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: sizeStyles.fontSize,
                    color: textColor,
                  },
                ]}
              >
                {children}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: RADIUS.md,
  },
  container: {
    position: "relative",
    overflow: "hidden",
    minWidth: 120,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: "OutfitSemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
});

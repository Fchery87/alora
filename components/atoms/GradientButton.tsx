import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator as RNActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { RADIUS, TEXT } from "@/lib/theme";
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

  const sizeStyles = React.useMemo(() => {
    switch (size) {
      case "sm":
        return { paddingVertical: 10, paddingHorizontal: 14, fontSize: 13 };
      case "lg":
        return { paddingVertical: 16, paddingHorizontal: 18, fontSize: 16 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 16, fontSize: 15 };
    }
  }, [size]);

  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const fillTone = React.useMemo(() => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.colors.sage,
          textColor: theme.text.primaryInverse,
          borderColor: "transparent",
        };
      case "accent":
        return {
          backgroundColor: theme.colors.gold,
          textColor: TEXT.primary,
          borderColor: "transparent",
        };
      case "primary":
      default:
        return {
          backgroundColor: theme.colors.terracotta,
          textColor: theme.text.primaryInverse,
          borderColor: "transparent",
        };
    }
  }, [theme, variant]);

  const outlineTone = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      borderColor: theme.colors.terracotta,
      textColor: theme.colors.terracotta,
    }),
    [theme]
  );

  const ghostTone = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      borderColor: "transparent",
      textColor: theme.text.primary,
    }),
    [theme]
  );

  const tone = isOutline ? outlineTone : isGhost ? ghostTone : fillTone;
  const activityIndicatorColor = tone.textColor;

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
        accessibilityRole="button"
      >
        <View
          style={[
            styles.container,
            sizeStyles,
            { borderRadius: RADIUS.md },
            {
              backgroundColor: tone.backgroundColor,
              borderColor: tone.borderColor,
              borderWidth: isOutline ? 1 : 0,
            },
          ]}
        >
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
                    color: tone.textColor,
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
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: "CareJournalUISemiBold",
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
});

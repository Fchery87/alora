import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { RADIUS, COLORS } from "@/lib/theme";

interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "sm" | "md";
  delay?: number;
}

export function Tag({
  children,
  selected = false,
  onPress,
  removable = false,
  onRemove,
  disabled = false,
  variant = "default",
  size = "md",
  delay = 0,
}: TagProps) {
  const getColors = () => {
    if (selected) {
      switch (variant) {
        case "primary":
          return {
            background: COLORS.primary,
            text: "#ffffff",
            border: COLORS.primary,
          };
        case "secondary":
          return {
            background: COLORS.secondary,
            text: "#ffffff",
            border: COLORS.secondary,
          };
        case "accent":
          return {
            background: COLORS.accent,
            text: "#ffffff",
            border: COLORS.accent,
          };
        default:
          return {
            background: COLORS.primary,
            text: "#ffffff",
            border: COLORS.primary,
          };
      }
    }

    // Unselected state
    switch (variant) {
      case "primary":
        return {
          background: "transparent",
          text: COLORS.primary,
          border: COLORS.primary,
        };
      case "secondary":
        return {
          background: "transparent",
          text: COLORS.secondary,
          border: COLORS.secondary,
        };
      case "accent":
        return {
          background: "transparent",
          text: COLORS.accent,
          border: COLORS.accent,
        };
      default:
        return {
          background: "transparent",
          text: COLORS.secondary,
          border: "rgba(139, 154, 125, 0.5)",
        };
    }
  };

  const colors = getColors();

  const sizeStyles =
    size === "sm"
      ? { paddingVertical: 4, paddingHorizontal: 10, fontSize: 12 }
      : { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 };

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: removable
            ? sizeStyles.paddingHorizontal
            : sizeStyles.paddingHorizontal,
        },
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {children}
      </Text>

      {removable && onRemove && (
        <Pressable
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="close-circle"
            size={size === "sm" ? 14 : 16}
            color={selected ? "#ffffff" : colors.text}
          />
        </Pressable>
      )}
    </View>
  );

  if (onPress) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay,
          dampingRatio: 0.8,
          stiffness: 150,
        }}
      >
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [pressed && !disabled && styles.pressed]}
        >
          {content}
        </Pressable>
      </MotiView>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        dampingRatio: 0.8,
        stiffness: 150,
      }}
    >
      {content}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    gap: 4,
  },
  text: {
    fontFamily: "OutfitMedium",
  },
  removeButton: {
    marginLeft: 2,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
});

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { color, font, radius, space, typeScale } from "@/lib/design/careJournal/tokens";

type StampButtonProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  left?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function StampButton({
  label,
  onPress,
  active = false,
  disabled = false,
  left,
  testID,
  accessibilityLabel,
  style,
}: StampButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Add ${label}`}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        active ? styles.active : styles.inactive,
        disabled && styles.disabled,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
    paddingHorizontal: space[3],
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: color.paper.wash,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
  },
  left: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: font.ui.medium,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.strong,
  },
  inactive: {
    borderColor: color.paper.edge,
  },
  active: {
    borderColor: color.pigment.clay,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.55,
  },
});


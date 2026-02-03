import { useMemo, type ReactNode } from "react";
import { MotiPressable, type MotiPressableProps } from "moti/interactions";
import { cssInterop } from "react-native-css-interop";
import { Text } from "./Text";

const StyledMotiPressable = cssInterop(MotiPressable, {
  className: "style",
}) as React.ComponentType<
  MotiPressableProps & { className?: string; children: ReactNode }
>;

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  style?: any;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  style,
}: ButtonProps) {
  const containerClasses = useMemo(() => {
    let classes = "rounded-xl flex-row items-center justify-center";

    // Size
    if (size === "sm") classes += " px-3 py-2";
    if (size === "md") classes += " px-6 py-3";
    if (size === "lg") classes += " px-8 py-4";

    // Variant - Celestial Nurture design system
    if (variant === "primary")
      classes += " bg-terracotta-500 border border-terracotta-600";
    if (variant === "secondary")
      classes += " bg-sage-500 border border-sage-600";
    if (variant === "outline")
      classes += " bg-transparent border-2 border-terracotta-500";
    if (variant === "ghost") classes += " bg-transparent";
    if (variant === "glass")
      classes +=
        " bg-cream-50/70 border border-terracotta-200 backdrop-blur-md";

    if (disabled) classes += " opacity-50";

    return classes;
  }, [variant, size, disabled]);

  const textClasses = useMemo(() => {
    let classes = "font-semibold text-center";

    // Size text
    if (size === "sm") classes += " text-sm";
    if (size === "md") classes += " text-base";
    if (size === "lg") classes += " text-lg";

    // Variant text color - Celestial Nurture design system
    if (variant === "primary") classes += " text-white";
    if (variant === "secondary") classes += " text-white";
    if (variant === "outline") classes += " text-terracotta-500";
    if (variant === "ghost") classes += " text-warm-dark";
    if (variant === "glass") classes += " text-warm-dark";

    return classes;
  }, [variant, size]);

  return (
    <StyledMotiPressable
      onPress={disabled ? undefined : onPress}
      animate={({ pressed }) => {
        "worklet";
        return {
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
          scale: pressed ? 0.98 : 1,
        };
      }}
      className={`${containerClasses} ${className}`}
      style={style}
    >
      <Text className={textClasses}>{children}</Text>
    </StyledMotiPressable>
  );
}

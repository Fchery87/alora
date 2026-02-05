import { View, ViewProps, StyleSheet } from "react-native";
import { useMemo } from "react";
import { SHADOWS } from "@/lib/theme";

interface CardProps extends ViewProps {
  className?: string;
  variant?: "default" | "elevated" | "soft" | "outlined" | "glass";
}

export function Card({
  className = "",
  variant = "default",
  children,
  style,
  ...props
}: CardProps) {
  const variantStyles = useMemo(() => {
    switch (variant) {
      case "elevated":
        return {
          container: styles.elevated,
          classes: "bg-cream-50 border border-cream-200",
        };
      case "soft":
        return {
          container: styles.soft,
          classes: "bg-cream-100 border border-cream-200",
        };
      case "outlined":
        return {
          container: {},
          classes: "bg-transparent border-2 border-terracotta/30",
        };
      case "glass":
        return {
          container: styles.glass,
          classes: "bg-cream-50/80 border border-cream-200/70",
        };
      case "default":
      default:
        return {
          container: styles.default,
          classes: "bg-cream-50 border border-cream-200",
        };
    }
  }, [variant]);

  return (
    <View
      className={`rounded-2xl p-4 ${variantStyles.classes} ${className}`}
      style={[variantStyles.container, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    shadowColor: SHADOWS.sm.shadowColor,
    shadowOffset: SHADOWS.sm.shadowOffset,
    shadowOpacity: SHADOWS.sm.shadowOpacity,
    shadowRadius: SHADOWS.sm.shadowRadius,
    elevation: SHADOWS.sm.elevation,
  },
  elevated: {
    shadowColor: SHADOWS.md.shadowColor,
    shadowOffset: SHADOWS.md.shadowOffset,
    shadowOpacity: SHADOWS.md.shadowOpacity,
    shadowRadius: SHADOWS.md.shadowRadius,
    elevation: SHADOWS.md.elevation,
  },
  soft: {
    shadowColor: SHADOWS.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: SHADOWS.sm.elevation,
  },
  glass: {
    shadowColor: SHADOWS.sm.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: SHADOWS.sm.elevation,
  },
});

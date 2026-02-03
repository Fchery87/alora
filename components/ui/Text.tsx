import { Text as RNText, TextProps, TextStyle } from "react-native";
import { TYPOGRAPHY, TEXT, COLORS } from "@/lib/theme";

interface CustomTextProps extends TextProps {
  className?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "title"
    | "subtitle"
    | "body"
    | "caption"
    | "label";
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "inverse"
    | "terracotta"
    | "sage"
    | "gold";
}

export function Text({
  className = "",
  variant = "body",
  color = "primary",
  style,
  ...props
}: CustomTextProps) {
  // Get color based on color prop
  const getColor = (): string => {
    switch (color) {
      case "primary":
        return TEXT.primary;
      case "secondary":
        return TEXT.secondary;
      case "tertiary":
        return TEXT.tertiary;
      case "inverse":
        return TEXT.inverse;
      case "terracotta":
        return COLORS.terracotta;
      case "sage":
        return COLORS.sage;
      case "gold":
        return COLORS.gold;
      default:
        return TEXT.primary;
    }
  };

  // Get styles based on variant
  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case "h1":
        return {
          fontSize: TYPOGRAPHY.headings.h1.fontSize,
          fontFamily: TYPOGRAPHY.headings.h1.fontFamily,
          letterSpacing: TYPOGRAPHY.headings.h1.letterSpacing,
          lineHeight: TYPOGRAPHY.headings.h1.lineHeight,
          fontWeight: "700",
          color: getColor(),
        };
      case "h2":
        return {
          fontSize: TYPOGRAPHY.headings.h2.fontSize,
          fontFamily: TYPOGRAPHY.headings.h2.fontFamily,
          letterSpacing: TYPOGRAPHY.headings.h2.letterSpacing,
          lineHeight: TYPOGRAPHY.headings.h2.lineHeight,
          fontWeight: "600",
          color: getColor(),
        };
      case "h3":
        return {
          fontSize: TYPOGRAPHY.headings.h3.fontSize,
          fontFamily: TYPOGRAPHY.headings.h3.fontFamily,
          letterSpacing: TYPOGRAPHY.headings.h3.letterSpacing,
          lineHeight: TYPOGRAPHY.headings.h3.lineHeight,
          fontWeight: "600",
          color: getColor(),
        };
      case "title":
        return {
          fontSize: TYPOGRAPHY.headings.h2.fontSize,
          fontFamily: TYPOGRAPHY.headings.h2.fontFamily,
          letterSpacing: TYPOGRAPHY.headings.h2.letterSpacing,
          lineHeight: TYPOGRAPHY.headings.h2.lineHeight,
          fontWeight: "700",
          color: getColor(),
        };
      case "subtitle":
        return {
          fontSize: TYPOGRAPHY.headings.h4.fontSize,
          fontFamily: TYPOGRAPHY.headings.h4.fontFamily,
          letterSpacing: TYPOGRAPHY.headings.h4.letterSpacing,
          lineHeight: TYPOGRAPHY.headings.h4.lineHeight,
          fontWeight: "500",
          color: getColor(),
        };
      case "body":
        return {
          fontSize: TYPOGRAPHY.body.regular.fontSize,
          fontFamily: TYPOGRAPHY.body.regular.fontFamily,
          lineHeight: TYPOGRAPHY.body.regular.lineHeight,
          fontWeight: "400",
          color: getColor(),
        };
      case "caption":
        return {
          fontSize: TYPOGRAPHY.body.small.fontSize,
          fontFamily: TYPOGRAPHY.body.small.fontFamily,
          lineHeight: TYPOGRAPHY.body.small.lineHeight,
          fontWeight: "400",
          color: getColor(),
        };
      case "label":
        return {
          fontSize: 11,
          fontFamily: TYPOGRAPHY.body.small.fontFamily,
          lineHeight: 14,
          fontWeight: "600",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: getColor(),
        };
      default:
        return {
          fontSize: TYPOGRAPHY.body.regular.fontSize,
          fontFamily: TYPOGRAPHY.body.regular.fontFamily,
          lineHeight: TYPOGRAPHY.body.regular.lineHeight,
          color: getColor(),
        };
    }
  };

  return (
    <RNText
      className={`${className}`}
      style={[getVariantStyles(), style]}
      {...props}
    />
  );
}

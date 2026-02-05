import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { COLORS, BACKGROUND, SHADOWS, TEXT as THEME_TEXT } from "@/lib/theme";

interface AloraLogoProps {
  size?: number;
  showText?: boolean;
}

export function AloraLogo({ size = 120, showText = true }: AloraLogoProps) {
  const logoSvg = `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <!-- Outer seal ring -->
      <circle cx="60" cy="60" r="54" fill="none" stroke="${BACKGROUND.tertiary}" stroke-width="2"/>
      <circle cx="60" cy="60" r="52" fill="none" stroke="${COLORS.terracotta}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.55"/>

      <!-- Leaf (growth) -->
      <path d="M60 18 Q78 26 88 38 Q84 58 72 74 Q68 78 60 78 Q52 78 48 74 Q36 58 32 38 Q42 26 60 18"
            fill="${COLORS.sage}" opacity="0.92"/>

      <!-- Heart (care) -->
      <path d="M60 56 C51 47 38 47 38 60 C38 74 50 90 60 90 C70 90 82 74 82 60 C82 47 69 47 60 56"
            fill="${COLORS.terracotta}" opacity="0.92"/>

      <!-- Center dot (ritual / stamp mark) -->
      <circle cx="60" cy="56" r="3" fill="${COLORS.gold}" opacity="0.95"/>
    </svg>
  `;

  return (
    <View style={[styles.container, { height: size + (showText ? 16 : 0) }]}>
      <View style={styles.logoWrapper}>
        <View style={styles.logoBackground}>
          <SvgXml xml={logoSvg} width={size} height={size} />
        </View>
      </View>
      {showText && (
        <View style={styles.textWrapper}>
          <Text style={styles.aloraText}>alora</Text>
          <Text style={styles.tagline}>nurture • grow • thrive</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    ...SHADOWS.md,
    borderRadius: 24,
    overflow: "hidden",
  },
  logoBackground: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  textWrapper: {
    marginTop: 8,
    alignItems: "center",
  },
  aloraText: {
    fontSize: 24,
    fontFamily: "CareJournalHeadingSemiBold",
    letterSpacing: -0.3,
    color: THEME_TEXT.primary,
    textTransform: "lowercase",
  },
  tagline: {
    fontSize: 11,
    fontFamily: "CareJournalUIMedium",
    letterSpacing: 1.4,
    color: THEME_TEXT.tertiary,
    marginTop: 2,
    textTransform: "uppercase",
  },
});

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";

interface AloraLogoProps {
  size?: number;
  showText?: boolean;
}

export function AloraLogo({ size = 120, showText = true }: AloraLogoProps) {
  const logoSvg = `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="1"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="1"/>
        </linearGradient>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="1"/>
          <stop offset="100%" stop-color="#ec4899" stop-opacity="1"/>
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="1"/>
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="1"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Outer Shield/Protection Circle -->
      <circle cx="60" cy="60" r="55" fill="none" stroke="url(#shieldGradient)" stroke-width="2" opacity="0.3"/>

      <!-- Nurturing Leaf (growth, nature) -->
      <g filter="url(#glow)">
        <path d="M60 15 Q80 25 90 35 Q85 55 75 70 Q70 75 60 75 Q50 75 45 70 Q35 55 15 35 Q40 25 60 15"
              fill="url(#leafGradient)" opacity="0.9"/>

        <!-- Leaf veins -->
        <path d="M60 20 L60 40" stroke="#ffffff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
        <path d="M60 30 L50 35" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
        <path d="M60 30 L70 35" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
      </g>

      <!-- Caring Heart (parental love, wellness) -->
      <g filter="url(#glow)">
        <path d="M60 55 C50 45 35 45 35 60 C35 75 50 95 60 95 C70 95 85 75 85 60 C85 45 70 45 60 55"
              fill="url(#heartGradient)" opacity="0.9"/>

        <!-- Heart glow/sparkles -->
        <circle cx="45" cy="52" r="2" fill="#ffffff" opacity="0.6"/>
        <circle cx="75" cy="52" r="2" fill="#ffffff" opacity="0.6"/>
        <circle cx="60" cy="45" r="1.5" fill="#ffffff" opacity="0.5"/>
      </g>

      <!-- Protection/Dots (security, trust) -->
      <circle cx="30" cy="90" r="3" fill="#6366f1" opacity="0.6"/>
      <circle cx="60" cy="95" r="3" fill="#8b5cf6" opacity="0.6"/>
      <circle cx="90" cy="90" r="3" fill="#22c55e" opacity="0.6"/>
    </svg>
  `;

  return (
    <View style={[styles.container, { height: size + (showText ? 16 : 0) }]}>
      <View style={styles.logoWrapper}>
        <LinearGradient
          colors={["#f8fafc", "#f1f5f9"]}
          style={styles.logoBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SvgXml xml={logoSvg} width={size} height={size} style={styles.logoSvg} />
        </LinearGradient>
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
    shadowColor: "rgba(99, 102, 241, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    borderRadius: 24,
    overflow: "hidden",
  },
  logoBackground: {
    padding: 12,
    borderRadius: 24,
  },
  logoSvg: {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  textWrapper: {
    marginTop: 8,
    alignItems: "center",
  },
  aloraText: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#0f172a",
    textTransform: "lowercase",
  },
  tagline: {
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 2,
    color: "#64748b",
    marginTop: 2,
    textTransform: "uppercase",
  },
});

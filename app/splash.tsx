import React, { useEffect, useState } from "react";
import type { MotiTransition } from "@/lib/moti-types";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { MotiView, AnimatePresence } from "moti";
import { GRADIENTS, SHADOWS, TYPOGRAPHY, COLORS } from "@/lib/theme";
import { softSpring } from "@/lib/animations";

const logoSvg = `
  <svg viewBox="0 0 120 120" width="200" height="200">
    <defs>
      <linearGradient id="leafSplash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22c55e" stop-opacity="1"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="heartSplash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e" stop-opacity="1"/>
        <stop offset="100%" stop-color="#ec4899" stop-opacity="1"/>
      </linearGradient>
      <filter id="glowSplash" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Nurturing Leaf -->
    <g filter="url(#glowSplash)">
      <path d="M60 15 Q80 25 90 35 Q85 55 75 70 Q70 75 60 75 Q50 75 45 70 Q35 55 15 35 Q40 25 60 15"
            fill="url(#leafSplash)" opacity="0.9"/>
      <path d="M60 20 L60 40" stroke="#ffffff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
      <path d="M60 30 L50 35" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
      <path d="M60 30 L70 35" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
    </g>

    <!-- Caring Heart -->
    <g filter="url(#glowSplash)">
      <path d="M60 55 C50 45 35 45 35 60 C35 75 50 95 60 95 C70 95 85 75 85 60 C85 45 70 45 60 55"
            fill="url(#heartSplash)" opacity="0.9"/>
      <circle cx="45" cy="52" r="2" fill="#ffffff" opacity="0.6"/>
      <circle cx="75" cy="52" r="2" fill="#ffffff" opacity="0.6"/>
      <circle cx="60" cy="45" r="1.5" fill="#ffffff" opacity="0.5"/>
    </g>
  </svg>
`;

const floatingCircles = [
  { id: 1, size: 60, x: -40, y: 60, opacity: 0.1, color: "#6366f1" },
  { id: 2, size: 40, x: 150, y: 40, opacity: 0.15, color: "#22c55e" },
  { id: 3, size: 80, x: 130, y: 120, opacity: 0.08, color: "#f43f5e" },
  { id: 4, size: 50, x: -30, y: 130, opacity: 0.12, color: "#8b5cf6" },
];

export default function SplashScreen() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    // Stagger animations
    const logoTimer = setTimeout(() => setLogoVisible(true), 300);
    const taglineTimer = setTimeout(() => setTaglineVisible(true), 800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  return (
    <LinearGradient
      colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Floating decorative circles */}
      {floatingCircles.map((circle, index) => (
        <MotiView
          key={circle.id}
          from={{ opacity: 0, scale: 0, translateY: 50 }}
          animate={{
            opacity: circle.opacity,
            scale: 1,
            translateY: 0,
          }}
          transition={
            { ...softSpring, delay: 100 + index * 100 } as MotiTransition
          }
          style={[
            styles.floatingCircle,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              backgroundColor: circle.color,
              transform: [{ translateX: circle.x }, { translateY: circle.y }],
            },
          ]}
        />
      ))}

      {/* Logo */}
      <AnimatePresence>
        {logoVisible && (
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={
              {
                type: "spring",
                dampingRatio: 0.7,
                stiffness: 150,
              } as MotiTransition
            }
            style={styles.logoContainer}
          >
            <View style={[styles.logoWrapper, SHADOWS.xl]}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.25)",
                  "rgba(255, 255, 255, 0.15)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <SvgXml xml={logoSvg} width={160} height={160} />
            </View>

            <Text style={styles.aloraText}>alora</Text>
            <View style={styles.tagline}>
              <Text style={styles.taglineWord}>nurture</Text>
              <Text style={styles.taglineDot}>•</Text>
              <Text style={styles.taglineWord}>grow</Text>
              <Text style={styles.taglineDot}>•</Text>
              <Text style={styles.taglineWord}>thrive</Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Tagline */}
      {taglineVisible && (
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ ...softSpring, delay: 400 } as MotiTransition}
          style={styles.taglineBottom}
        >
          <Text style={styles.motto}>Your journey through parenthood</Text>
        </MotiView>
      )}

      {/* Loading indicator */}
      {taglineVisible && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...softSpring, delay: 600 } as MotiTransition}
          style={styles.loadingContainer}
        >
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <MotiView
                key={i}
                from={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={
                  {
                    type: "spring",
                    duration: 600,
                    repeat: -Infinity,
                    delay: i * 200,
                  } as MotiTransition
                }
                style={styles.loadingDot}
              />
            ))}
          </View>
        </MotiView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCircle: {
    position: "absolute",
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: "center",
    zIndex: 10,
  },
  logoWrapper: {
    borderRadius: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  aloraText: {
    ...TYPOGRAPHY.headings.h1,
    color: COLORS.primaryInverse,
    marginTop: 24,
    letterSpacing: -1,
    textTransform: "lowercase",
  },
  tagline: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  taglineWord: {
    ...TYPOGRAPHY.body.small,
    color: COLORS.primaryInverse,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  taglineDot: {
    ...TYPOGRAPHY.body.small,
    color: COLORS.primaryInverse,
    marginHorizontal: 6,
    opacity: 0.6,
  },
  taglineBottom: {
    marginTop: 32,
    opacity: 0.9,
  },
  motto: {
    ...TYPOGRAPHY.body.regular,
    color: COLORS.primaryInverse,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    marginTop: 48,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

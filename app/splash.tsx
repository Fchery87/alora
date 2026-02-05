import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { MotiView } from "moti";
import type { MotiTransition } from "@/lib/moti-types";
import { AloraLogo } from "@/components/atoms/AloraLogo";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";
import { softSpring } from "@/lib/animations";

const DOTS = [0, 1, 2] as const;

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 10 }}
        transition={{ ...softSpring, delay: 60 } as MotiTransition}
        style={styles.center}
      >
        <View style={styles.logoCard}>
          <AloraLogo size={112} showText />
        </View>

        <Text style={styles.motto}>A calm logbook for the newborn days.</Text>

        <View style={styles.dotsRow} accessibilityLabel="Loading">
          {DOTS.map((i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.35, transform: [{ scale: 0.9 }] }}
              animate={{ opacity: 0.9, transform: [{ scale: 1.1 }] }}
              transition={
                {
                  type: "timing",
                  duration: 700,
                  delay: i * 160,
                  repeat: -1,
                  repeatReverse: true,
                } as MotiTransition
              }
              style={[
                styles.dot,
                { backgroundColor: i === 1 ? COLORS.sage : COLORS.terracotta },
              ]}
            />
          ))}
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  center: {
    width: "100%",
    alignItems: "center",
  },
  logoCard: {
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    backgroundColor: BACKGROUND.primary,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    ...SHADOWS.sm,
  },
  motto: {
    ...TYPOGRAPHY.body.regular,
    marginTop: 18,
    color: THEME_TEXT.secondary,
    textAlign: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
});


import { createTamagui } from "@tamagui/core";

export const tamaguiConfig = createTamagui({
  tokens: {
    color: {
      primary: "#6366f1",
      primaryLight: "#818cf8",
      primaryDark: "#4f46e5",
      secondary: "#ec4899",
      secondaryLight: "#f472b6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    space: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      8: 32,
      10: 40,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      "2xl": 32,
      "3xl": 40,
      "4xl": 48,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
  },
  themes: {
    light: {
      background: "#ffffff",
      color: "#0f172a",
      border: "#e2e8f0",
    },
    dark: {
      background: "#0f172a",
      color: "#f8fafc",
      border: "#334155",
    },
  },
});

export type TamaguiConfig = typeof tamaguiConfig;

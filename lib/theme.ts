/**
 * Alora Care Journal Design System
 * Paper + Ink editorial calm
 *
 * NOTE:
 * This module is used broadly across the app. To migrate safely, we keep the
 * existing export surface but map it onto the Care Journal palette and fonts.
 */

// =======================
// PRIMARY GRADIENTS - Warm Earth Tones
// =======================

export const GRADIENTS = {
  primary: {
    start: "#C46A4A",
    end: "#2F6B5B",
    stops: [0, 1],
  },
  secondary: {
    start: "#2F6B5B",
    end: "#D1A545",
    stops: [0, 1],
  },
  accent: {
    start: "#D1A545",
    end: "#C46A4A",
    stops: [0, 1],
  },
  calm: {
    start: "#FBF7F0",
    end: "#F4EEE4",
    stops: [0, 1],
  },
  success: {
    start: "#2F6B5B",
    end: "#2F6B5B",
    stops: [0, 1],
  },
  danger: {
    start: "#B24A3C",
    end: "#B24A3C",
    stops: [0, 1],
  },
  sunset: {
    start: "#C46A4A",
    end: "#D1A545",
    stops: [0, 1],
  },
  ocean: {
    start: "#2F5E8C",
    end: "#2F6B5B",
    stops: [0, 1],
  },
  lavender: {
    start: "#F4EEE4",
    end: "#E8DED0",
    stops: [0, 1],
  },
} as const;

// =======================
// GLASSMORPHISM TOKENS - Warm Earth Tones
// =======================

export const GLASS = {
  light: {
    background: "rgba(251, 247, 240, 0.72)",
    border: "rgba(232, 222, 208, 0.7)",
    shadow: "rgba(31, 35, 40, 0.06)",
  },
  dark: {
    background: "rgba(31, 35, 40, 0.72)",
    border: "rgba(232, 222, 208, 0.18)",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
} as const;

// =======================
// MODERN SHADOWS - Warm Tones
// =======================

export const SHADOWS = {
  sm: {
    shadowColor: "rgba(31, 35, 40, 0.06)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "rgba(31, 35, 40, 0.09)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 4,
  },
  lg: {
    shadowColor: "rgba(31, 35, 40, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: "rgba(31, 35, 40, 0.14)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: "rgba(196, 106, 74, 0.22)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

// =======================
// SPACING & RADIUS
// =======================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 24,
  full: 9999,
} as const;

// =======================
// TYPOGRAPHY
// =======================

export const TYPOGRAPHY = {
  headings: {
    h1: {
      fontSize: 32,
      fontFamily: "CareJournalHeadingSemiBold",
      letterSpacing: -0.3,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: "CareJournalHeadingSemiBold",
      letterSpacing: -0.2,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: "CareJournalHeadingMedium",
      letterSpacing: -0.1,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontFamily: "CareJournalHeadingMedium",
      letterSpacing: -0.2,
      lineHeight: 26,
    },
  },
  body: {
    large: {
      fontSize: 16,
      fontFamily: "CareJournalUI",
      lineHeight: 24,
    },
    regular: {
      fontSize: 14,
      fontFamily: "CareJournalUI",
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontFamily: "CareJournalUI",
      lineHeight: 16,
    },
  },
  button: {
    fontSize: 15,
    fontFamily: "CareJournalUIMedium",
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
} as const;

// =======================
// BACKGROUNDS - Light & Dark Mode
// =======================

export const BACKGROUND = {
  primary: "#FBF7F0",
  secondary: "#F4EEE4",
  tertiary: "#E8DED0",
  card: "#FBF7F0",
  overlay: "rgba(31, 35, 40, 0.7)",
  // Dark mode
  primaryDark: "#14171B",
  secondaryDark: "#1F2328",
  tertiaryDark: "#2A3036",
  cardDark: "#1F2328",
} as const;

// =======================
// TEXT COLORS - Light & Dark Mode
// =======================

export const TEXT = {
  primary: "#1F2328",
  secondary: "#4A4F55",
  tertiary: "#70767D",
  inverse: "#FBF7F0",
  primaryInverse: "#FBF7F0",
  // Dark mode
  primaryDark: "#FBF7F0",
  secondaryDark: "#D8D0C5",
  tertiaryDark: "#B2ABA3",
} as const;

// =======================
// SOLID COLORS - Warm Earth Tone Palette
// =======================

export const COLORS = {
  // Primary palette
  terracotta: "#C46A4A",
  sage: "#2F6B5B",
  gold: "#D1A545",
  cream: "#FBF7F0",
  charcoal: "#1F2328",
  warmDark: "#1F2328",
  warmLight: "#F4EEE4",

  // Additional earth tones
  clay: "#C46A4A",
  sand: "#E8DED0",
  moss: "#2F6B5B",
  stone: "#70767D",

  // Semantic colors
  primaryInverse: "#FBF7F0",
  primary: "#C46A4A",
  secondary: "#2F6B5B",
  accent: "#D1A545",
  success: "#2F6B5B",
  danger: "#B24A3C",
  warning: "#D1A545",
  info: "#2F5E8C",
} as const;

// =======================
// ANIMATION TIMING
// =======================

export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
  extraSlow: 800,
  spring: {
    dampingRatio: 0.8,
    stiffness: 150,
  },
  bouncy: {
    dampingRatio: 0.5,
    stiffness: 200,
  },
} as const;

// =======================
// Z-INDEX LAYERS
// =======================

export const Z_INDEX = {
  statusBar: 50,
  toast: 60,
  modal: 70,
  dropdown: 80,
  keyboardAvoiding: 90,
  safeArea: 999,
} as const;

// =======================
// DARK MODE SHADOWS
// =======================

export const DARK_SHADOWS = {
  sm: {
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: "rgba(212, 165, 116, 0.2)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

// =======================
// COMPLETE THEME OBJECTS
// =======================

export type ThemeMode = "light" | "dark" | "auto";

export interface Theme {
  mode: "light" | "dark";
  gradients: typeof GRADIENTS;
  glass: typeof GLASS.light | typeof GLASS.dark;
  shadows: typeof SHADOWS | typeof DARK_SHADOWS;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    primaryInverse: string;
  };
  colors: typeof COLORS;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  typography: typeof TYPOGRAPHY;
  animation: typeof ANIMATION;
  zIndex: typeof Z_INDEX;
}

export const lightTheme: Theme = {
  mode: "light",
  gradients: GRADIENTS,
  glass: GLASS.light,
  shadows: SHADOWS,
  background: {
    primary: BACKGROUND.primary,
    secondary: BACKGROUND.secondary,
    tertiary: BACKGROUND.tertiary,
    card: BACKGROUND.card,
    overlay: BACKGROUND.overlay,
  },
  text: {
    primary: TEXT.primary,
    secondary: TEXT.secondary,
    tertiary: TEXT.tertiary,
    inverse: TEXT.inverse,
    primaryInverse: TEXT.primaryInverse,
  },
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
  animation: ANIMATION,
  zIndex: Z_INDEX,
};

export const darkTheme: Theme = {
  mode: "dark",
  gradients: GRADIENTS,
  glass: GLASS.dark,
  shadows: DARK_SHADOWS,
  background: {
    primary: BACKGROUND.primaryDark,
    secondary: BACKGROUND.secondaryDark,
    tertiary: BACKGROUND.tertiaryDark,
    card: BACKGROUND.cardDark,
    overlay: "rgba(0, 0, 0, 0.7)",
  },
  text: {
    primary: TEXT.primaryDark,
    secondary: TEXT.secondaryDark,
    tertiary: TEXT.tertiaryDark,
    inverse: TEXT.primary,
    primaryInverse: TEXT.primary,
  },
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
  animation: ANIMATION,
  zIndex: Z_INDEX,
};

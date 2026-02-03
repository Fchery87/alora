/**
 * Alora Celestial Nurture Design System
 * Warm, nurturing, earth-tone aesthetic
 */

// =======================
// PRIMARY GRADIENTS - Warm Earth Tones
// =======================

export const GRADIENTS = {
  primary: {
    start: "#D4A574",
    end: "#8B9A7D",
    stops: [0, 1],
  },
  secondary: {
    start: "#8B9A7D",
    end: "#C9A227",
    stops: [0, 1],
  },
  accent: {
    start: "#C9A227",
    end: "#D4A574",
    stops: [0, 1],
  },
  calm: {
    start: "#D4A574",
    end: "#E8DED1",
    stops: [0, 1],
  },
  success: {
    start: "#8B9A7D",
    end: "#6B8E6B",
    stops: [0, 1],
  },
  danger: {
    start: "#C17A5C",
    end: "#A65A42",
    stops: [0, 1],
  },
  sunset: {
    start: "#D4A574",
    end: "#C17A5C",
    stops: [0, 1],
  },
  ocean: {
    start: "#6B7A6B",
    end: "#8B9A7D",
    stops: [0, 1],
  },
  lavender: {
    start: "#9B8B7B",
    end: "#B8A89B",
    stops: [0, 1],
  },
} as const;

// =======================
// GLASSMORPHISM TOKENS - Warm Earth Tones
// =======================

export const GLASS = {
  light: {
    background: "rgba(250, 247, 242, 0.7)",
    border: "rgba(250, 247, 242, 0.5)",
    shadow: "rgba(45, 42, 38, 0.05)",
  },
  dark: {
    background: "rgba(45, 42, 38, 0.7)",
    border: "rgba(245, 240, 235, 0.1)",
    shadow: "rgba(26, 26, 26, 0.3)",
  },
} as const;

// =======================
// MODERN SHADOWS - Warm Tones
// =======================

export const SHADOWS = {
  sm: {
    shadowColor: "rgba(45, 42, 38, 0.08)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "rgba(45, 42, 38, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "rgba(45, 42, 38, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: "rgba(45, 42, 38, 0.15)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: "rgba(212, 165, 116, 0.3)",
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
  xl: 20,
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
      fontFamily: "CrimsonProBold",
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: "CrimsonProMedium",
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: "CrimsonProMedium",
      letterSpacing: -0.2,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontFamily: "CrimsonProMedium",
      letterSpacing: -0.2,
      lineHeight: 26,
    },
  },
  body: {
    large: {
      fontSize: 16,
      fontFamily: "DMSans",
      lineHeight: 24,
    },
    regular: {
      fontSize: 14,
      fontFamily: "DMSans",
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontFamily: "DMSans",
      lineHeight: 16,
    },
  },
  button: {
    fontSize: 15,
    fontFamily: "DMSansMedium",
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
} as const;

// =======================
// BACKGROUNDS - Light & Dark Mode
// =======================

export const BACKGROUND = {
  primary: "#FAF7F2",
  secondary: "#F5F0EB",
  tertiary: "#EDE8E2",
  card: "#FFFFFF",
  overlay: "rgba(45, 42, 38, 0.7)",
  // Dark mode
  primaryDark: "#1A1A1A",
  secondaryDark: "#2D2A26",
  tertiaryDark: "#3A3530",
  cardDark: "#2D2A26",
} as const;

// =======================
// TEXT COLORS - Light & Dark Mode
// =======================

export const TEXT = {
  primary: "#2D2A26",
  secondary: "#5A5550",
  tertiary: "#8A8580",
  inverse: "#F5F0EB",
  primaryInverse: "#F5F0EB",
  // Dark mode
  primaryDark: "#F5F0EB",
  secondaryDark: "#D4CFC8",
  tertiaryDark: "#A8A39E",
} as const;

// =======================
// SOLID COLORS - Warm Earth Tone Palette
// =======================

export const COLORS = {
  // Primary palette
  terracotta: "#D4A574",
  sage: "#8B9A7D",
  gold: "#C9A227",
  cream: "#FAF7F2",
  charcoal: "#1A1A1A",
  warmDark: "#2D2A26",
  warmLight: "#F5F0EB",

  // Additional earth tones
  clay: "#C17A5C",
  sand: "#E8DED1",
  moss: "#6B7A6B",
  stone: "#9B8B7B",

  // Semantic colors
  primaryInverse: "#F5F0EB",
  primary: "#D4A574",
  secondary: "#8B9A7D",
  accent: "#C9A227",
  success: "#8B9A7D",
  danger: "#C17A5C",
  warning: "#D4A574",
  info: "#6B7A6B",
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

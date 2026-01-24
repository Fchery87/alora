/**
 * Alora Modern Design System
 * Calming, supportive, premium aesthetic
 */

// =======================
// PRIMARY GRADIENTS
// =======================

export const GRADIENTS = {
  primary: {
    start: "#6366f1",
    end: "#8b5cf6",
    stops: [0, 1],
  },
  secondary: {
    start: "#10b981",
    end: "#22d3ee",
    stops: [0, 1],
  },
  accent: {
    start: "#f59e0b",
    end: "#f472b6",
    stops: [0, 1],
  },
  calm: {
    start: "#818cf8",
    end: "#a78bfa",
    stops: [0, 1],
  },
  success: {
    start: "#34d399",
    end: "#22c55e",
    stops: [0, 1],
  },
  danger: {
    start: "#fb7185",
    end: "#ef4444",
    stops: [0, 1],
  },
  sunset: {
    start: "#fb923c",
    end: "#f43f5e",
    stops: [0, 1],
  },
  ocean: {
    start: "#3b82f6",
    end: "#14b8a6",
    stops: [0, 1],
  },
  lavender: {
    start: "#a78bfa",
    end: "#e879f9",
    stops: [0, 1],
  },
} as const;

// =======================
// GLASSMORPHISM TOKENS
// =======================

export const GLASS = {
  light: {
    background: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.5)",
    shadow: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    background: "rgba(30, 41, 59, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
} as const;

// =======================
// MODERN SHADOWS
// =======================

export const SHADOWS = {
  sm: {
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: "rgba(99, 102, 241, 0.3)",
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
      fontWeight: "700" as const,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "600" as const,
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      letterSpacing: -0.2,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: "600" as const,
      letterSpacing: -0.2,
      lineHeight: 26,
    },
  },
  body: {
    large: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
    },
    regular: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
  },
  button: {
    fontSize: 15,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
} as const;

// =======================
// BACKGROUNDS
// =======================

export const BACKGROUND = {
  primary: "#ffffff",
  secondary: "#f8fafc",
  tertiary: "#f1f5f9",
  card: "#ffffff",
  overlay: "rgba(15, 23, 42, 0.7)",
} as const;

// =======================
// TEXT COLORS
// =======================

export const TEXT = {
  primary: "#0f172a",
  secondary: "#475569",
  tertiary: "#94a3b8",
  inverse: "#ffffff",
  primaryInverse: "#ffffff",
} as const;

// =======================
// SOLID COLORS
// =======================

export const COLORS = {
  indigo: "#6366f1",
  emerald: "#22c55e",
  amber: "#f59e0b",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  pink: "#ec4899",
  primaryInverse: "#ffffff",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
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

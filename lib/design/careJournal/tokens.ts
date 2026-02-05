export const color = {
  paper: {
    base: "#FBF7F0",
    wash: "#F4EEE4",
    edge: "#E8DED0",
  },
  ink: {
    strong: "#1F2328",
    muted: "#4A4F55",
    faint: "#70767D",
    inverse: "#FBF7F0",
  },
  pigment: {
    clay: "#C46A4A",
    clayDeep: "#A8563A",
    sage: "#2F6B5B",
    marigold: "#D1A545",
    skyInfo: "#2F5E8C",
    rustError: "#B24A3C",
  },
} as const;

export const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48] as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
} as const;

export const shadow = {
  sm: { y: 1, blur: 6, alpha: 0.06 },
  md: { y: 6, blur: 18, alpha: 0.1 },
} as const;

export const font = {
  heading: {
    regular: "CareJournalHeading",
    medium: "CareJournalHeadingMedium",
    semibold: "CareJournalHeadingSemiBold",
  },
  ui: {
    regular: "CareJournalUI",
    medium: "CareJournalUIMedium",
    semibold: "CareJournalUISemiBold",
  },
} as const;

export const typeScale = {
  display: { fontSize: 34, lineHeight: 40, letterSpacing: -0.3 },
  h1: { fontSize: 28, lineHeight: 34, letterSpacing: -0.2 },
  h2: { fontSize: 22, lineHeight: 28, letterSpacing: -0.1 },
  h3: { fontSize: 18, lineHeight: 24, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodySm: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
} as const;


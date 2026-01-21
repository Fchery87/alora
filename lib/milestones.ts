export interface Milestone {
  id: string;
  babyId: string;
  title: string;
  description?: string;
  category: "motor" | "cognitive" | "language" | "social" | "custom";
  date?: string;
  ageMonths?: number;
  isCustom: boolean;
  isCelebrated: boolean;
  photoUrl?: string;
  createdAt: string;
}

export interface PredefinedMilestone {
  title: string;
  description: string;
  category: "motor" | "cognitive" | "language" | "social";
  ageMonths: number;
  rangeMonths: number;
}

export const PREDEFINED_MILESTONES: PredefinedMilestone[] = [
  {
    title: "First smile",
    description: "Social smile in response to caregivers",
    category: "social",
    ageMonths: 2,
    rangeMonths: 1,
  },
  {
    title: "Rolls over",
    description: "Rolls from tummy to back",
    category: "motor",
    ageMonths: 4,
    rangeMonths: 2,
  },
  {
    title: "Sits without support",
    description: "Can sit independently for short periods",
    category: "motor",
    ageMonths: 6,
    rangeMonths: 2,
  },
  {
    title: "Starts solid foods",
    description: "Begins eating solid foods",
    category: "cognitive",
    ageMonths: 6,
    rangeMonths: 1,
  },
  {
    title: "Crawls",
    description: "Moves by crawling on hands and knees",
    category: "motor",
    ageMonths: 8,
    rangeMonths: 3,
  },
  {
    title: "Says first words",
    description: "Speaks first recognizable words like 'mama' or 'dada'",
    category: "language",
    ageMonths: 10,
    rangeMonths: 4,
  },
  {
    title: "Stands alone",
    description: "Can stand without holding onto anything",
    category: "motor",
    ageMonths: 11,
    rangeMonths: 3,
  },
  {
    title: "Takes first steps",
    description: "Walks independently without support",
    category: "motor",
    ageMonths: 13,
    rangeMonths: 3,
  },
  {
    title: "Points to objects",
    description: "Points to objects to show interest",
    category: "cognitive",
    ageMonths: 12,
    rangeMonths: 2,
  },
  {
    title: "Drinks from cup",
    description: "Can drink from a cup without help",
    category: "cognitive",
    ageMonths: 14,
    rangeMonths: 3,
  },
  {
    title: "Says 10+ words",
    description: "Vocabulary expands to 10 or more words",
    category: "language",
    ageMonths: 18,
    rangeMonths: 6,
  },
  {
    title: "Runs",
    description: "Can run with good coordination",
    category: "motor",
    ageMonths: 18,
    rangeMonths: 4,
  },
  {
    title: "Two-word phrases",
    description: "Starts combining two words together",
    category: "language",
    ageMonths: 20,
    rangeMonths: 4,
  },
  {
    title: "Plays pretend",
    description: "Engages in imaginative play",
    category: "cognitive",
    ageMonths: 22,
    rangeMonths: 4,
  },
  {
    title: "Kicks ball",
    description: "Can kick a ball forward",
    category: "motor",
    ageMonths: 20,
    rangeMonths: 4,
  },
  {
    title: "Follows simple commands",
    description: "Understands and follows simple instructions",
    category: "cognitive",
    ageMonths: 18,
    rangeMonths: 3,
  },
  {
    title: "Uses spoon",
    description: "Can feed self with a spoon",
    category: "cognitive",
    ageMonths: 22,
    rangeMonths: 4,
  },
  {
    title: "Tower of 4+ blocks",
    description: "Can stack 4 or more blocks",
    category: "cognitive",
    ageMonths: 15,
    rangeMonths: 3,
  },
  {
    title: "Turns pages",
    description: "Can turn pages of a book one at a time",
    category: "motor",
    ageMonths: 14,
    rangeMonths: 3,
  },
  {
    title: "Waves goodbye",
    description: "Waves hand to say goodbye",
    category: "social",
    ageMonths: 10,
    rangeMonths: 3,
  },
];

export const MILESTONE_CATEGORIES = {
  motor: { label: "Motor Skills", icon: "body", color: "#22c55e" },
  cognitive: { label: "Cognitive", icon: "bulb", color: "#f59e0b" },
  language: { label: "Language", icon: "chatbubbles", color: "#6366f1" },
  social: { label: "Social & Emotional", icon: "people", color: "#ec4899" },
  custom: { label: "Custom", icon: "star", color: "#8b5cf6" },
};

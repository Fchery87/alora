/**
 * Self-care nudges and daily affirmations library
 * Provides gentle, supportive messages for parent well-being
 */

export interface SelfCareNudge {
  id: string;
  message: string;
  category: "hydration" | "rest" | "nutrition" | "mindfulness";
}

export interface DailyAffirmation {
  id: string;
  message: string;
  theme: string;
}

/**
 * Self-care nudge messages - gentle and supportive
 * Focused on hydration, rest, nutrition, and mindfulness
 */
export const SELF_CARE_NUDGES: SelfCareNudge[] = [
  // Hydration nudges
  {
    id: "hydration_1",
    message:
      "Don't forget to hydrate. A glass of water can make a big difference.",
    category: "hydration",
  },
  {
    id: "hydration_2",
    message:
      "When was the last time you had some water? Your body will thank you.",
    category: "hydration",
  },
  {
    id: "hydration_3",
    message: "A gentle reminder to sip some water throughout the day.",
    category: "hydration",
  },
  {
    id: "hydration_4",
    message:
      "Hydration check! Consider grabbing a glass of water when you can.",
    category: "hydration",
  },
  // Rest nudges
  {
    id: "rest_1",
    message:
      "It's been a while since you logged any rest. Have you had a moment to yourself today?",
    category: "rest",
  },
  {
    id: "rest_2",
    message:
      "Even a few minutes of rest can help you recharge. You deserve it.",
    category: "rest",
  },
  {
    id: "rest_3",
    message: "Consider taking a brief pause. You've been doing wonderful work.",
    category: "rest",
  },
  {
    id: "rest_4",
    message: "Your wellbeing matters too. Have you been able to rest today?",
    category: "rest",
  },
  {
    id: "rest_5",
    message: "A small rest break can give you energy for what's ahead.",
    category: "rest",
  },
  // Nutrition nudges
  {
    id: "nutrition_1",
    message: "Don't forget to hydrate and eat something nourishing.",
    category: "nutrition",
  },
  {
    id: "nutrition_2",
    message:
      "Have you had something to eat today? A snack can help keep your energy up.",
    category: "nutrition",
  },
  {
    id: "nutrition_3",
    message: "Gentle reminder to nourish yourself. You're worth caring for.",
    category: "nutrition",
  },
  {
    id: "nutrition_4",
    message: "Consider taking a moment to have a snack or meal.",
    category: "nutrition",
  },
  // Mindfulness nudges
  {
    id: "mindfulness_1",
    message: "Take a deep breath. You're doing amazing.",
    category: "mindfulness",
  },
  {
    id: "mindfulness_2",
    message: "Pause for a moment. Notice how you're feeling right now.",
    category: "mindfulness",
  },
  {
    id: "mindfulness_3",
    message:
      "Three deep breaths can help center you. Give it a try if you'd like.",
    category: "mindfulness",
  },
  {
    id: "mindfulness_4",
    message: "Notice one thing around you that brings you a moment of calm.",
    category: "mindfulness",
  },
  {
    id: "mindfulness_5",
    message:
      "A moment of mindfulness: What's one thing you're grateful for right now?",
    category: "mindfulness",
  },
  {
    id: "mindfulness_6",
    message:
      "Breathe in slowly, breathe out slowly. You're doing the best you can.",
    category: "mindfulness",
  },
];

/**
 * Daily affirmations - validating and encouraging
 * Designed to support parents through their journey
 */
export const DAILY_AFFIRMATIONS: DailyAffirmation[] = [
  {
    id: "affirmation_1",
    message: "You are enough, exactly as you are.",
    theme: "self-worth",
  },
  {
    id: "affirmation_2",
    message: "It's okay to have hard days. You're still a wonderful parent.",
    theme: "resilience",
  },
  {
    id: "affirmation_3",
    message: "Every small step forward is worth celebrating.",
    theme: "progress",
  },
  {
    id: "affirmation_4",
    message: "Your love matters more than perfection.",
    theme: "love",
  },
  {
    id: "affirmation_5",
    message: "You're doing better than you think you are.",
    theme: "confidence",
  },
  {
    id: "affirmation_6",
    message: "Take it one moment at a time. That's enough.",
    theme: "presence",
  },
  {
    id: "affirmation_7",
    message: "Your baby is lucky to have you.",
    theme: "connection",
  },
  {
    id: "affirmation_8",
    message: "It's okay to ask for help. You don't have to do this alone.",
    theme: "support",
  },
  {
    id: "affirmation_9",
    message: "Resting when you need it is a form of strength, not weakness.",
    theme: "rest",
  },
  {
    id: "affirmation_10",
    message: "You're learning and growing every single day.",
    theme: "growth",
  },
  {
    id: "affirmation_11",
    message:
      "Your needs matter too. Taking care of yourself helps you take care of your baby.",
    theme: "self-care",
  },
  {
    id: "affirmation_12",
    message:
      "This stage won't last forever. You're building a foundation of love.",
    theme: "perspective",
  },
  {
    id: "affirmation_13",
    message: "You're doing your best, and that is always enough.",
    theme: "acceptance",
  },
  {
    id: "affirmation_14",
    message: "Every challenge you face is building your resilience.",
    theme: "strength",
  },
  {
    id: "affirmation_15",
    message: "Your presence and attention are the greatest gifts you can give.",
    theme: "presence",
  },
  {
    id: "affirmation_16",
    message: "Trust yourself. You know your baby better than anyone else.",
    theme: "trust",
  },
  {
    id: "affirmation_17",
    message:
      "There's no perfect way to do this, only your way. That's beautiful.",
    theme: "authenticity",
  },
  {
    id: "affirmation_18",
    message: "Remember to celebrate your small victories today.",
    theme: "celebration",
  },
  {
    id: "affirmation_19",
    message:
      "You are building a beautiful bond with your baby, one moment at a time.",
    theme: "bonding",
  },
  {
    id: "affirmation_20",
    message:
      "It's okay to not have all the answers. You're figuring it out as you go.",
    theme: "learning",
  },
];

/**
 * Get day of year from date (0-364/365)
 * @param date - Date to calculate day of year for
 * @returns Day of year (0-indexed)
 */
function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / 1000 / 60 / 60 / 24);
}

/**
 * Get a random self-care nudge
 * Uses the current date as a seed to provide variety over time
 * @param category - Optional category to filter nudges
 * @param date - Optional date to use for seeding (defaults to current date)
 * @returns A self-care nudge based on the date seed
 */
export function getRandomSelfCareNudge(
  category?: "hydration" | "rest" | "nutrition" | "mindfulness",
  date?: Date
): SelfCareNudge {
  const availableNudges = category
    ? SELF_CARE_NUDGES.filter((nudge) => nudge.category === category)
    : SELF_CARE_NUDGES;

  const today = date || new Date();
  const dayOfYear = getDayOfYear(today);

  // Rotate through nudges based on day of year
  const index = dayOfYear % availableNudges.length;
  return availableNudges[index];
}

/**
 * Get a random daily affirmation
 * Uses the current date to provide a unique affirmation each day
 * @param date - Optional date to use for seeding (defaults to current date)
 * @returns A daily affirmation based on the date seed
 */
export function getDailyAffirmation(date?: Date): DailyAffirmation {
  const today = date || new Date();
  const dayOfYear = getDayOfYear(today);

  // Rotate through affirmations based on day of year
  const index = dayOfYear % DAILY_AFFIRMATIONS.length;
  return DAILY_AFFIRMATIONS[index];
}

/**
 * Get self-care nudge by ID
 */
export function getSelfCareNudgeById(id: string): SelfCareNudge | undefined {
  return SELF_CARE_NUDGES.find((nudge) => nudge.id === id);
}

/**
 * Get affirmation by ID
 */
export function getAffirmationById(id: string): DailyAffirmation | undefined {
  return DAILY_AFFIRMATIONS.find((affirmation) => affirmation.id === id);
}

/**
 * Get all self-care nudges by category
 */
export function getSelfCareNudgesByCategory(
  category: "hydration" | "rest" | "nutrition" | "mindfulness"
): SelfCareNudge[] {
  return SELF_CARE_NUDGES.filter((nudge) => nudge.category === category);
}

/**
 * Get all affirmations by theme
 */
export function getAffirmationsByTheme(theme: string): DailyAffirmation[] {
  return DAILY_AFFIRMATIONS.filter(
    (affirmation) => affirmation.theme === theme
  );
}

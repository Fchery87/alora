export interface PartnerPrompt {
  id: string;
  message: string;
  trigger: "weekly" | "lowEnergy" | "manyNightFeeds" | "manual";
  category: "checkin" | "appreciation" | "support" | "reflection";
}

export const PARTNER_PROMPTS: PartnerPrompt[] = [
  {
    id: "weekly-checkin",
    message:
      "How are you doing? Let's take a moment to check in with each other.",
    trigger: "weekly",
    category: "checkin",
  },
  {
    id: "partner-rest",
    message:
      "Your partner has had several wakeful nights. Consider planning some rest time for them.",
    trigger: "manyNightFeeds",
    category: "support",
  },
  {
    id: "both-low-energy",
    message:
      "Both of you have reported low energy lately. Maybe it's time for a quiet moment together?",
    trigger: "lowEnergy",
    category: "support",
  },
  {
    id: "appreciation-1",
    message:
      "Take a moment to tell your partner what you appreciate about them today.",
    trigger: "manual",
    category: "appreciation",
  },
  {
    id: "gratitude-1",
    message: "What are three things you're grateful for about your partner?",
    trigger: "manual",
    category: "reflection",
  },
  {
    id: "teamwork-1",
    message:
      "Remember, you're a great team. What's one thing your partner does that you're thankful for?",
    trigger: "manual",
    category: "appreciation",
  },
  {
    id: "communication-1",
    message: "How can you better support each other this week?",
    trigger: "weekly",
    category: "checkin",
  },
  {
    id: "date-night",
    message:
      "When was your last date night? Consider planning something special, even if it's at home.",
    trigger: "manual",
    category: "reflection",
  },
];

export function getPartnerPrompt(
  trigger: PartnerPrompt["trigger"]
): PartnerPrompt | null {
  const prompts = PARTNER_PROMPTS.filter((p) => p.trigger === trigger);
  return prompts.length > 0 ? prompts[0] : null;
}

export function getRandomPrompt(): PartnerPrompt {
  return PARTNER_PROMPTS[Math.floor(Math.random() * PARTNER_PROMPTS.length)];
}

export const REFLECTION_QUESTIONS = [
  "What went well this week?",
  "What was challenging?",
  "How can we support each other better?",
  "What made you laugh this week?",
  "What's something you're looking forward to?",
  "How are you really feeling?",
  "What does self-care look like for you right now?",
  "What's one thing we can do together this week?",
];

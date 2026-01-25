export type DailyInsight = {
  id: string;
  title: string;
  message: string;
  tone: "encouraging" | "supportive" | "practical";
};

type MoodLabel = "great" | "good" | "okay" | "low" | "struggling";

type MoodEntry = {
  mood: MoodLabel;
  createdAt: number;
};

function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function lastMood(entries: MoodEntry[]): MoodEntry | null {
  if (entries.length === 0) return null;
  return entries.reduce((latest, cur) =>
    cur.createdAt > latest.createdAt ? cur : latest
  );
}

export function generateDailyInsight(params: {
  moodEntries: MoodEntry[] | null | undefined;
  now?: Date;
}): DailyInsight {
  const now = params.now ?? new Date();
  const key = dayKey(now);
  const moodEntries = params.moodEntries ?? [];

  const latest = lastMood(moodEntries);

  if (!latest) {
    return {
      id: `insight-${key}-baseline`,
      title: "A gentle start",
      tone: "encouraging",
      message:
        "If you have the energy, try a quick check-in today. Naming how you feel can make the day a little lighter.",
    };
  }

  switch (latest.mood) {
    case "great":
      return {
        id: `insight-${key}-great`,
        title: "Keep the momentum",
        tone: "practical",
        message:
          "You’re feeling strong today. If you can, take 2 minutes to note what helped—sleep, support, a walk—so you can repeat it on harder days.",
      };
    case "good":
      return {
        id: `insight-${key}-good`,
        title: "Protect your energy",
        tone: "practical",
        message:
          "You’re doing well. Pick one small thing to make tomorrow easier (fill a water bottle, prep a snack, or plan a short rest).",
      };
    case "okay":
      return {
        id: `insight-${key}-okay`,
        title: "One small win",
        tone: "supportive",
        message:
          "An “okay” day still counts. Choose one tiny win: breathe for 30 seconds, eat something simple, or ask for one specific help.",
      };
    case "low":
      return {
        id: `insight-${key}-low`,
        title: "Lower the bar (on purpose)",
        tone: "supportive",
        message:
          "Today might be heavy. Focus on essentials only: you, baby, food, water. Everything else can wait.",
      };
    case "struggling":
      return {
        id: `insight-${key}-struggling`,
        title: "You don’t have to carry this alone",
        tone: "supportive",
        message:
          "If you’re struggling, reach out to someone you trust today. If you’re in immediate danger or feel unsafe, call local emergency services.",
      };
  }
}

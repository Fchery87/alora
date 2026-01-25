import type { Resource } from "./resources";

export type MoodLabel = "great" | "good" | "okay" | "low" | "struggling";

export type SmartResourceRecommendation = {
  resource: Resource;
  reason: string;
  score: number;
};

function moodScore(mood: MoodLabel): number {
  switch (mood) {
    case "great":
      return 5;
    case "good":
      return 4;
    case "okay":
      return 3;
    case "low":
      return 2;
    case "struggling":
      return 1;
  }
}

export function recommendResources(params: {
  resources: Resource[];
  moodEntries: { mood: MoodLabel; createdAt: number }[] | null | undefined;
  nowMs: number;
  limit?: number;
}): SmartResourceRecommendation[] {
  const resources = params.resources;
  const moodEntries = params.moodEntries ?? [];
  const limit = params.limit ?? 2;

  const sinceMs = params.nowMs - 7 * 24 * 60 * 60 * 1000;
  const recent = moodEntries.filter((m) => m.createdAt >= sinceMs);

  const last = recent.length
    ? recent.reduce((a, b) => (b.createdAt > a.createdAt ? b : a))
    : null;

  const avg =
    recent.length > 0
      ? recent.reduce((sum, m) => sum + moodScore(m.mood), 0) / recent.length
      : null;

  const recs: SmartResourceRecommendation[] = [];

  for (const r of resources) {
    let score = 0;
    let reason = "";

    if (avg !== null && avg <= 2.5) {
      if (r.category === "postpartum") {
        score += 3;
        reason =
          "Your recent check-ins suggest you may need extra support right now.";
      }
      if (r.tags.includes("support") || r.tags.includes("mental-health")) {
        score += 2;
      }
    }

    if (last && (last.mood === "low" || last.mood === "struggling")) {
      if (r.category === "postpartum") score += 2;
      if (r.category === "nutrition") score += 1;
    }

    if (score > 0) {
      recs.push({ resource: r, reason, score });
    }
  }

  return recs.sort((a, b) => b.score - a.score).slice(0, limit);
}

import { describe, it, expect } from "vitest";
import { generateDailyInsight } from "../../lib/insights/rules";

describe("generateDailyInsight", () => {
  it("returns a baseline insight when no mood entries exist", () => {
    const insight = generateDailyInsight({
      moodEntries: [],
      now: new Date(2026, 0, 25, 9, 0, 0),
    });
    expect(insight.id).toContain("insight-2026-01-25");
    expect(insight.title).toBeTruthy();
    expect(insight.message).toMatch(/check-in/i);
  });

  it("uses the latest mood entry by createdAt", () => {
    const insight = generateDailyInsight({
      moodEntries: [
        { mood: "low", createdAt: 10 },
        { mood: "great", createdAt: 20 },
      ],
      now: new Date(2026, 0, 25, 9, 0, 0),
    });
    expect(insight.id).toContain("great");
  });
});

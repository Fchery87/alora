import { describe, it, expect, beforeEach } from "vitest";
import {
  SELF_CARE_NUDGES,
  DAILY_AFFIRMATIONS,
  getRandomSelfCareNudge,
  getDailyAffirmation,
  getSelfCareNudgeById,
  getAffirmationById,
  getSelfCareNudgesByCategory,
  getAffirmationsByTheme,
} from "@/lib/self-care";

describe("Self-Care Library", () => {
  describe("SELF_CARE_NUDGES", () => {
    it("should have self-care nudge messages", () => {
      expect(SELF_CARE_NUDGES.length).toBeGreaterThan(0);
    });

    it("should have all required categories", () => {
      const categories = new Set(SELF_CARE_NUDGES.map((n) => n.category));
      expect(categories.has("hydration")).toBe(true);
      expect(categories.has("rest")).toBe(true);
      expect(categories.has("nutrition")).toBe(true);
      expect(categories.has("mindfulness")).toBe(true);
    });

    it("should have unique IDs", () => {
      const ids = SELF_CARE_NUDGES.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have messages without 'should' language", () => {
      SELF_CARE_NUDGES.forEach((nudge) => {
        expect(nudge.message.toLowerCase()).not.toMatch(/\byou should\b/);
        expect(nudge.message.toLowerCase()).not.toMatch(/\bshould\b/);
      });
    });

    it("should have gentle and supportive messages", () => {
      SELF_CARE_NUDGES.forEach((nudge) => {
        expect(nudge.message.length).toBeGreaterThan(10);
        expect(nudge.message).toMatch(/[.!?]$/);
      });
    });

    it("should have hydration nudges", () => {
      const hydrationNudges = getSelfCareNudgesByCategory("hydration");
      expect(hydrationNudges.length).toBeGreaterThan(0);
      hydrationNudges.forEach((nudge) => {
        expect(nudge.category).toBe("hydration");
      });
    });

    it("should have rest nudges", () => {
      const restNudges = getSelfCareNudgesByCategory("rest");
      expect(restNudges.length).toBeGreaterThan(0);
      restNudges.forEach((nudge) => {
        expect(nudge.category).toBe("rest");
      });
    });

    it("should have nutrition nudges", () => {
      const nutritionNudges = getSelfCareNudgesByCategory("nutrition");
      expect(nutritionNudges.length).toBeGreaterThan(0);
      nutritionNudges.forEach((nudge) => {
        expect(nudge.category).toBe("nutrition");
      });
    });

    it("should have mindfulness nudges", () => {
      const mindfulnessNudges = getSelfCareNudgesByCategory("mindfulness");
      expect(mindfulnessNudges.length).toBeGreaterThan(0);
      mindfulnessNudges.forEach((nudge) => {
        expect(nudge.category).toBe("mindfulness");
      });
    });
  });

  describe("DAILY_AFFIRMATIONS", () => {
    it("should have daily affirmation messages", () => {
      expect(DAILY_AFFIRMATIONS.length).toBeGreaterThan(0);
    });

    it("should have unique IDs", () => {
      const ids = DAILY_AFFIRMATIONS.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have themes for each affirmation", () => {
      DAILY_AFFIRMATIONS.forEach((affirmation) => {
        expect(affirmation.theme).toBeDefined();
        expect(affirmation.theme.length).toBeGreaterThan(0);
      });
    });

    it("should have validating and encouraging messages", () => {
      DAILY_AFFIRMATIONS.forEach((affirmation) => {
        expect(affirmation.message.length).toBeGreaterThan(10);
        expect(affirmation.message).toMatch(/[.!?]$/);
      });
    });

    it("should have affirmations by theme", () => {
      const selfWorthAffirmations = getAffirmationsByTheme("self-worth");
      expect(selfWorthAffirmations.length).toBeGreaterThan(0);
      selfWorthAffirmations.forEach((affirmation) => {
        expect(affirmation.theme).toBe("self-worth");
      });
    });
  });

  describe("getRandomSelfCareNudge", () => {
    it("should return a self-care nudge", () => {
      const nudge = getRandomSelfCareNudge();
      expect(nudge).toBeDefined();
      expect(nudge.id).toBeDefined();
      expect(nudge.message).toBeDefined();
      expect(nudge.category).toBeDefined();
    });

    it("should return a nudge from specified category", () => {
      const hydrationNudge = getRandomSelfCareNudge("hydration");
      expect(hydrationNudge.category).toBe("hydration");
    });

    it("should be deterministic for same day", () => {
      const fixedDate = new Date("2024-01-01");

      const nudge1 = getRandomSelfCareNudge(undefined, fixedDate);
      const nudge2 = getRandomSelfCareNudge(undefined, fixedDate);

      expect(nudge1.id).toBe(nudge2.id);
      expect(nudge1.message).toBe(nudge2.message);
    });

    it("should return different nudges on different days", () => {
      const day1 = new Date("2024-01-01");
      const day2 = new Date("2024-01-02");

      const nudge1 = getRandomSelfCareNudge(undefined, day1);
      const nudge2 = getRandomSelfCareNudge(undefined, day2);

      // Nudges should be different (unless there's only one nudge in category)
      if (SELF_CARE_NUDGES.length > 1) {
        expect(nudge1.id).not.toBe(nudge2.id);
      }
    });
  });

  describe("getDailyAffirmation", () => {
    it("should return a daily affirmation", () => {
      const affirmation = getDailyAffirmation();
      expect(affirmation).toBeDefined();
      expect(affirmation.id).toBeDefined();
      expect(affirmation.message).toBeDefined();
      expect(affirmation.theme).toBeDefined();
    });

    it("should be deterministic for same day", () => {
      const fixedDate = new Date("2024-01-01");

      const affirmation1 = getDailyAffirmation(fixedDate);
      const affirmation2 = getDailyAffirmation(fixedDate);

      expect(affirmation1.id).toBe(affirmation2.id);
      expect(affirmation1.message).toBe(affirmation2.message);
    });

    it("should return different affirmations on different days", () => {
      const day1 = new Date("2024-01-01");
      const day2 = new Date("2024-01-02");

      const affirmation1 = getDailyAffirmation(day1);
      const affirmation2 = getDailyAffirmation(day2);

      // Affirmations should be different (unless there's only one affirmation)
      if (DAILY_AFFIRMATIONS.length > 1) {
        expect(affirmation1.id).not.toBe(affirmation2.id);
      }
    });

    it("should cycle through affirmations over many days", () => {
      const seenAffirmations = new Set();

      for (let day = 0; day < DAILY_AFFIRMATIONS.length + 5; day++) {
        const date = new Date("2024-01-01");
        date.setDate(date.getDate() + day);

        const affirmation = getDailyAffirmation(date);
        seenAffirmations.add(affirmation.id);
      }

      // Should have seen at least all unique affirmations
      expect(seenAffirmations.size).toBe(DAILY_AFFIRMATIONS.length);
    });
  });

  describe("getSelfCareNudgeById", () => {
    it("should return nudge by ID", () => {
      const nudge = getSelfCareNudgeById("hydration_1");
      expect(nudge).toBeDefined();
      expect(nudge?.id).toBe("hydration_1");
    });

    it("should return undefined for non-existent ID", () => {
      const nudge = getSelfCareNudgeById("non_existent");
      expect(nudge).toBeUndefined();
    });
  });

  describe("getAffirmationById", () => {
    it("should return affirmation by ID", () => {
      const affirmation = getAffirmationById("affirmation_1");
      expect(affirmation).toBeDefined();
      expect(affirmation?.id).toBe("affirmation_1");
    });

    it("should return undefined for non-existent ID", () => {
      const affirmation = getAffirmationById("non_existent");
      expect(affirmation).toBeUndefined();
    });
  });

  describe("getSelfCareNudgesByCategory", () => {
    it("should return empty array for non-existent category", () => {
      const nudges = getSelfCareNudgesByCategory("non_existent" as any);
      expect(nudges).toEqual([]);
    });

    it("should return all nudges in category", () => {
      const hydrationNudges = getSelfCareNudgesByCategory("hydration");
      const allHydrationNudges = SELF_CARE_NUDGES.filter(
        (n) => n.category === "hydration"
      );
      expect(hydrationNudges.length).toBe(allHydrationNudges.length);
    });
  });

  describe("getAffirmationsByTheme", () => {
    it("should return empty array for non-existent theme", () => {
      const affirmations = getAffirmationsByTheme("non_existent");
      expect(affirmations).toEqual([]);
    });

    it("should return all affirmations with theme", () => {
      const selfWorthAffirmations = getAffirmationsByTheme("self-worth");
      const allSelfWorthAffirmations = DAILY_AFFIRMATIONS.filter(
        (a) => a.theme === "self-worth"
      );
      expect(selfWorthAffirmations.length).toBe(
        allSelfWorthAffirmations.length
      );
    });
  });

  describe("Message Content Quality", () => {
    it("should avoid judgmental language in nudges", () => {
      const judgmentalWords = ["lazy", "should", "must", "fail", "bad"];
      SELF_CARE_NUDGES.forEach((nudge) => {
        const lowerMessage = nudge.message.toLowerCase();
        judgmentalWords.forEach((word) => {
          expect(lowerMessage).not.toContain(word);
        });
      });
    });

    it("should use inviting language in nudges", () => {
      const invitingWords = [
        "consider",
        "maybe",
        "try",
        "if you'd like",
        "when you can",
        "gentle",
        "reminder",
      ];
      const hasInvitingLanguage = SELF_CARE_NUDGES.some((nudge) => {
        const lowerMessage = nudge.message.toLowerCase();
        return invitingWords.some((word) => lowerMessage.includes(word));
      });
      expect(hasInvitingLanguage).toBe(true);
    });

    it("should provide variety in message length", () => {
      const lengths = SELF_CARE_NUDGES.map((n) => n.message.length);
      const minLength = Math.min(...lengths);
      const maxLength = Math.max(...lengths);
      expect(maxLength - minLength).toBeGreaterThan(20); // At least some variation
    });
  });
});

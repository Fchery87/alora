import { describe, it, expect } from "vitest";
import { recommendResources } from "../../lib/smart-resources";
import { RESOURCES } from "../../lib/resources";

describe("recommendResources", () => {
  it("recommends postpartum resources when mood is low", () => {
    const recs = recommendResources({
      resources: RESOURCES,
      nowMs: Date.now(),
      moodEntries: [
        { mood: "low", createdAt: Date.now() - 1000 },
        { mood: "struggling", createdAt: Date.now() - 2000 },
      ],
      limit: 2,
    });

    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].resource.category).toBe("postpartum");
  });
});

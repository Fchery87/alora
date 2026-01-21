import { describe, it, expect } from "vitest";
import {
  PREDEFINED_MILESTONES,
  MILESTONE_CATEGORIES,
} from "../../lib/milestones";

describe("PREDEFINED_MILESTONES", () => {
  it("should contain predefined milestones", () => {
    expect(PREDEFINED_MILESTONES.length).toBeGreaterThan(0);
  });

  it("should have valid category values", () => {
    const validCategories = ["motor", "cognitive", "language", "social"];
    PREDEFINED_MILESTONES.forEach((milestone) => {
      expect(validCategories).toContain(milestone.category);
    });
  });

  it("should have age within valid range", () => {
    PREDEFINED_MILESTONES.forEach((milestone) => {
      expect(milestone.ageMonths).toBeGreaterThanOrEqual(0);
      expect(milestone.ageMonths).toBeLessThanOrEqual(24);
      expect(milestone.rangeMonths).toBeGreaterThan(0);
    });
  });

  it("should have required string properties", () => {
    PREDEFINED_MILESTONES.forEach((milestone) => {
      expect(typeof milestone.title).toBe("string");
      expect(milestone.title.length).toBeGreaterThan(0);
      expect(typeof milestone.description).toBe("string");
      expect(milestone.description.length).toBeGreaterThan(0);
    });
  });

  it("should include first smile milestone", () => {
    const smile = PREDEFINED_MILESTONES.find((m) => m.title === "First smile");
    expect(smile).toBeDefined();
    expect(smile?.category).toBe("social");
  });

  it("should include walking milestone", () => {
    const walk = PREDEFINED_MILESTONES.find((m) =>
      m.title.includes("first steps")
    );
    expect(walk).toBeDefined();
    expect(walk?.category).toBe("motor");
  });
});

describe("MILESTONE_CATEGORIES", () => {
  it("should have all required categories", () => {
    const requiredCategories = [
      "motor",
      "cognitive",
      "language",
      "social",
      "custom",
    ];
    requiredCategories.forEach((category) => {
      expect(MILESTONE_CATEGORIES).toHaveProperty(category);
    });
  });

  it("should have valid label and color for each category", () => {
    Object.values(MILESTONE_CATEGORIES).forEach((category) => {
      expect(typeof category.label).toBe("string");
      expect(category.label.length).toBeGreaterThan(0);
      expect(typeof category.color).toBe("string");
      expect(category.color.startsWith("#")).toBe(true);
      expect(category.color.length).toBe(7);
    });
  });

  it("should have unique colors for each category", () => {
    const colors = Object.values(MILESTONE_CATEGORIES).map((c) => c.color);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});

describe("Milestone categorization and filtering", () => {
  it("should filter milestones by category", () => {
    const motorMilestones = PREDEFINED_MILESTONES.filter(
      (m) => m.category === "motor"
    );
    motorMilestones.forEach((m) => {
      expect(m.category).toBe("motor");
    });
    expect(motorMilestones.length).toBeGreaterThan(0);
  });

  it("should have milestones in all required categories", () => {
    const categories = new Set(PREDEFINED_MILESTONES.map((m) => m.category));
    expect(categories.has("motor")).toBe(true);
    expect(categories.has("cognitive")).toBe(true);
    expect(categories.has("language")).toBe(true);
    expect(categories.has("social")).toBe(true);
  });

  it("should not have custom category in predefined milestones", () => {
    const customMilestones = PREDEFINED_MILESTONES.filter(
      (m) => m.category === ("custom" as any)
    );
    expect(customMilestones.length).toBe(0);
  });
});

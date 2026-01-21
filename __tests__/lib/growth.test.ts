import { describe, it, expect } from "vitest";
import {
  calculatePercentile,
  getWHOData,
  getGrowthStatus,
  GROWTH_MILESTONES,
} from "../../lib/growth";

describe("calculatePercentile", () => {
  it("should handle invalid values", () => {
    expect(calculatePercentile(0, "weight", 6, "male")).toBeNull();
    expect(calculatePercentile(-5, "weight", 6, "male")).toBeNull();
  });

  it("should calculate percentile at P50 for median value", () => {
    const percentile = calculatePercentile(4.5, "weight", 1, "male");
    expect(percentile).toBeCloseTo(50, 0);
  });

  it("should calculate low percentile below P3", () => {
    const percentile = calculatePercentile(2.0, "weight", 0, "male");
    expect(percentile).toBeLessThan(3);
  });

  it("should calculate high percentile above P97", () => {
    const percentile = calculatePercentile(10.0, "weight", 6, "male");
    expect(percentile).toBeGreaterThan(97);
  });

  it("should handle different growth types", () => {
    const weightPercentile = calculatePercentile(5.0, "weight", 3, "male");
    const lengthPercentile = calculatePercentile(60, "length", 4, "male");
    const headPercentile = calculatePercentile(
      40,
      "head_circumference",
      4,
      "male"
    );

    expect(weightPercentile).not.toBeNull();
    expect(lengthPercentile).not.toBeNull();
    expect(headPercentile).not.toBeNull();
  });

  it("should handle female sex parameter", () => {
    const malePercentile = calculatePercentile(5.0, "weight", 3, "male");
    const femalePercentile = calculatePercentile(5.0, "weight", 3, "female");
    expect(typeof malePercentile).toBe("number");
    expect(typeof femalePercentile).toBe("number");
  });

  it("should clamp age to 0-24 months", () => {
    const lowAge = calculatePercentile(5, "weight", -5, "male");
    const highAge = calculatePercentile(5, "weight", 100, "male");
    expect(lowAge).not.toBeNull();
    expect(highAge).not.toBeNull();
  });
});

describe("getWHOData", () => {
  it("should return null for invalid type", () => {
    expect(getWHOData("invalid" as any, 6, "male")).toBeNull();
  });

  it("should return WHO data for valid parameters", () => {
    const data = getWHOData("weight", 6, "male");
    expect(data).not.toBeNull();
    expect(data?.p50).toBeCloseTo(7.9, 1);
  });

  it("should interpolate data for intermediate months", () => {
    const data = getWHOData("weight", 7, "male");
    expect(data).not.toBeNull();
    expect(data?.p50).toBeGreaterThan(7.9);
    expect(data?.p50).toBeLessThan(8.9);
  });

  it("should clamp age to valid range", () => {
    const minData = getWHOData("weight", 0, "male");
    const maxData = getWHOData("weight", 24, "male");
    expect(minData?.ageMonths).toBe(0);
    expect(maxData?.ageMonths).toBe(24);
  });

  it("should have all percentile values", () => {
    const data = getWHOData("weight", 12, "male");
    expect(data).toHaveProperty("p3");
    expect(data).toHaveProperty("p15");
    expect(data).toHaveProperty("p50");
    expect(data).toHaveProperty("p85");
    expect(data).toHaveProperty("p97");
  });
});

describe("getGrowthStatus", () => {
  it("should return unknown status for null percentile", () => {
    const status = getGrowthStatus(null);
    expect(status.status).toBe("average");
    expect(status.label).toBe("Unknown");
  });

  it("should return very low status for percentile < 3", () => {
    const status = getGrowthStatus(1);
    expect(status.status).toBe("low");
    expect(status.label).toBe("Very Low");
    expect(status.color).toBe("#ef4444");
  });

  it("should return below average status for percentile 3-15", () => {
    const status = getGrowthStatus(10);
    expect(status.status).toBe("below_average");
    expect(status.label).toBe("Below Average");
    expect(status.color).toBe("#f59e0b");
  });

  it("should return average status for percentile 15-85", () => {
    const status = getGrowthStatus(50);
    expect(status.status).toBe("average");
    expect(status.label).toBe("Average");
    expect(status.color).toBe("#22c55e");
  });

  it("should return above average status for percentile 85-97", () => {
    const status = getGrowthStatus(90);
    expect(status.status).toBe("above_average");
    expect(status.label).toBe("Above Average");
    expect(status.color).toBe("#22c55e");
  });

  it("should return very high status for percentile > 97", () => {
    const status = getGrowthStatus(99);
    expect(status.status).toBe("high");
    expect(status.label).toBe("Very High");
    expect(status.color).toBe("#ef4444");
  });

  it("should handle boundary values correctly", () => {
    expect(getGrowthStatus(2).status).toBe("low");
    expect(getGrowthStatus(14).status).toBe("below_average");
    expect(getGrowthStatus(86).status).toBe("above_average");
    expect(getGrowthStatus(98).status).toBe("high");
  });
});

describe("GROWTH_MILESTONES", () => {
  it("should contain expected milestones", () => {
    expect(GROWTH_MILESTONES.length).toBeGreaterThan(0);
  });

  it("should have valid age and value properties", () => {
    GROWTH_MILESTONES.forEach((milestone) => {
      expect(milestone.ageMonths).toBeGreaterThanOrEqual(0);
      expect(typeof milestone.value).toBe("number");
      expect(typeof milestone.label).toBe("string");
      expect(["weight", "length", "head_circumference"]).toContain(
        milestone.type
      );
    });
  });

  it("should include birth weight doubling milestone", () => {
    const doubleWeight = GROWTH_MILESTONES.find((m) =>
      m.label.includes("Doubles birth weight")
    );
    expect(doubleWeight).toBeDefined();
    expect(doubleWeight?.ageMonths).toBe(2);
  });
});

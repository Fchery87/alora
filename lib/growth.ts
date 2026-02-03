export interface GrowthMeasurement {
  id: string;
  babyId: string;
  type: "weight" | "length" | "head_circumference";
  value: number;
  unit: string;
  date: string;
  notes?: string;
  percentile?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WHOGrowthData {
  ageMonths: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export function calculatePercentile(
  value: number,
  type: "weight" | "length" | "head_circumference",
  ageMonths: number,
  sex: "male" | "female" = "male"
): number | null {
  const whoData = getWHOData(type, ageMonths, sex);
  if (!whoData || value <= 0) return null;

  if (value <= whoData.p3) return Math.max(0, (value / whoData.p3) * 3);
  if (value >= whoData.p97)
    return Math.min(
      100,
      97 + ((value - whoData.p97) / (whoData.p97 - whoData.p85)) * 3
    );

  if (value <= whoData.p50) {
    if (value <= whoData.p15) {
      const ratio = (value - whoData.p3) / (whoData.p15 - whoData.p3);
      return 3 + ratio * 12;
    } else {
      const ratio = (value - whoData.p15) / (whoData.p50 - whoData.p15);
      return 15 + ratio * 35;
    }
  } else {
    if (value < whoData.p85) {
      const ratio = (value - whoData.p50) / (whoData.p85 - whoData.p50);
      return 50 + ratio * 35;
    } else {
      const ratio = (value - whoData.p85) / (whoData.p97 - whoData.p85);
      return 85 + ratio * 12;
    }
  }
}

export function getWHOData(
  type: "weight" | "length" | "head_circumference",
  ageMonths: number,
  _sex: "male" | "female" = "male"
): WHOGrowthData | null {
  const clampedAge = Math.max(0, Math.min(24, ageMonths));

  const data: Record<string, WHOGrowthData[]> = {
    weight: [
      { ageMonths: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.7, p97: 4.2 },
      { ageMonths: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
      { ageMonths: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.4, p97: 7.0 },
      { ageMonths: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 7.9 },
      { ageMonths: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.6 },
      { ageMonths: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.2 },
      { ageMonths: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.7 },
      { ageMonths: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 10.0, p97: 10.9 },
      { ageMonths: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
      { ageMonths: 18, p3: 8.8, p15: 9.8, p50: 11.0, p85: 12.4, p97: 13.6 },
      { ageMonths: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.0 },
    ],
    length: [
      { ageMonths: 0, p3: 46.3, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
      { ageMonths: 1, p3: 50.8, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.6 },
      { ageMonths: 2, p3: 54.4, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.4 },
      { ageMonths: 3, p3: 57.3, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.5 },
      { ageMonths: 4, p3: 59.7, p15: 61.8, p50: 63.9, p85: 66.0, p97: 68.0 },
      { ageMonths: 5, p3: 61.7, p15: 63.8, p50: 65.9, p85: 68.0, p97: 70.1 },
      { ageMonths: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
      { ageMonths: 9, p3: 67.0, p15: 69.3, p50: 71.7, p85: 74.1, p97: 76.3 },
      { ageMonths: 12, p3: 71.0, p15: 73.5, p50: 76.0, p85: 78.5, p97: 81.0 },
      { ageMonths: 18, p3: 76.0, p15: 79.0, p50: 82.0, p85: 85.0, p97: 88.0 },
      { ageMonths: 24, p3: 80.0, p15: 83.5, p50: 87.0, p85: 90.5, p97: 94.0 },
    ],
    head_circumference: [
      { ageMonths: 0, p3: 32.1, p15: 33.6, p50: 35.1, p85: 36.7, p97: 38.3 },
      { ageMonths: 1, p3: 34.5, p15: 35.8, p50: 37.3, p85: 38.8, p97: 40.2 },
      { ageMonths: 2, p3: 36.4, p15: 37.8, p50: 39.1, p85: 40.5, p97: 41.8 },
      { ageMonths: 3, p3: 37.7, p15: 39.0, p50: 40.5, p85: 41.8, p97: 43.2 },
      { ageMonths: 4, p3: 38.8, p15: 40.1, p50: 41.4, p85: 42.8, p97: 44.1 },
      { ageMonths: 5, p3: 39.6, p15: 40.9, p50: 42.2, p85: 43.5, p97: 44.8 },
      { ageMonths: 6, p3: 40.4, p15: 41.6, p50: 42.9, p85: 44.2, p97: 45.5 },
      { ageMonths: 9, p3: 41.7, p15: 43.0, p50: 44.2, p85: 45.5, p97: 46.7 },
      { ageMonths: 12, p3: 42.6, p15: 44.0, p50: 45.2, p85: 46.5, p97: 47.7 },
      { ageMonths: 18, p3: 44.0, p15: 45.5, p50: 46.7, p85: 48.0, p97: 49.2 },
      { ageMonths: 24, p3: 45.0, p15: 46.5, p50: 48.0, p85: 49.5, p97: 50.7 },
    ],
  };

  const typeData = data[type];
  if (!typeData) return null;

  let lower = typeData[0];
  let upper = typeData[typeData.length - 1];

  for (let i = 0; i < typeData.length; i++) {
    if (typeData[i].ageMonths <= clampedAge) lower = typeData[i];
    if (typeData[i].ageMonths >= clampedAge && !upper) upper = typeData[i];
    if (typeData[i].ageMonths >= clampedAge) {
      upper = typeData[i];
      break;
    }
  }

  if (lower.ageMonths === upper.ageMonths) return lower;

  const ratio =
    (clampedAge - lower.ageMonths) / (upper.ageMonths - lower.ageMonths);

  return {
    ageMonths: clampedAge,
    p3: lower.p3 + (upper.p3 - lower.p3) * ratio,
    p15: lower.p15 + (upper.p15 - lower.p15) * ratio,
    p50: lower.p50 + (upper.p50 - lower.p50) * ratio,
    p85: lower.p85 + (upper.p85 - lower.p85) * ratio,
    p97: lower.p97 + (upper.p97 - lower.p97) * ratio,
  };
}

export function getGrowthStatus(percentile: number | null): {
  status: "low" | "below_average" | "average" | "above_average" | "high";
  color: string;
  label: string;
} {
  if (percentile === null) {
    return { status: "average", color: "#6b7280", label: "Unknown" };
  }
  if (percentile < 3)
    return { status: "low", color: "#ef4444", label: "Very Low" };
  if (percentile < 15)
    return {
      status: "below_average",
      color: "#f59e0b",
      label: "Below Average",
    };
  if (percentile > 97)
    return { status: "high", color: "#ef4444", label: "Very High" };
  if (percentile > 85)
    return {
      status: "above_average",
      color: "#22c55e",
      label: "Above Average",
    };
  return { status: "average", color: "#22c55e", label: "Average" };
}

export const GROWTH_MILESTONES = [
  { ageMonths: 2, type: "weight", value: 4.5, label: "Doubles birth weight" },
  { ageMonths: 5, type: "weight", value: 6.5, label: "Triples birth weight" },
  {
    ageMonths: 12,
    type: "weight",
    value: 9.5,
    label: "Almost triples birth weight",
  },
  {
    ageMonths: 24,
    type: "weight",
    value: 12.0,
    label: "Four times birth weight",
  },
  { ageMonths: 4, type: "length", value: 60, label: "60cm length" },
  { ageMonths: 12, type: "length", value: 75, label: "75cm length" },
  { ageMonths: 24, type: "length", value: 87, label: "87cm length" },
];

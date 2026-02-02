import { describe, it, expect } from "vitest";
import { toLocalISODateString } from "../../lib/dates";

describe("toLocalISODateString", () => {
  it("formats YYYY-MM-DD using local date parts", () => {
    const d = new Date(2026, 0, 25, 23, 59, 59);
    expect(toLocalISODateString(d)).toBe("2026-01-25");
  });
});

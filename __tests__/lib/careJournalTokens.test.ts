import { describe, expect, test } from "vitest";

describe("careJournal tokens", () => {
  test("exports core color tokens", async () => {
    const tokens = await import("@/lib/design/careJournal/tokens");
    expect(tokens.color.paper.base).toBe("#FBF7F0");
    expect(tokens.color.ink.strong).toBe("#1F2328");
    expect(tokens.color.pigment.clay).toBe("#C46A4A");
  });

  test("exports spacing and radius scales", async () => {
    const tokens = await import("@/lib/design/careJournal/tokens");
    expect(tokens.space).toEqual([0, 4, 8, 12, 16, 20, 24, 32, 40, 48]);
    expect(tokens.radius).toEqual({ sm: 8, md: 12, lg: 16, xl: 22 });
  });
});


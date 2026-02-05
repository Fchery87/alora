import { describe, expect, test } from "vitest";

import { BACKGROUND, TEXT, TYPOGRAPHY } from "@/lib/theme";

describe("theme (Care Journal)", () => {
  test("uses paper/ink defaults", () => {
    expect(BACKGROUND.primary).toBe("#FBF7F0");
    expect(TEXT.primary).toBe("#1F2328");
  });

  test("uses Care Journal fonts for headings and body", () => {
    expect(TYPOGRAPHY.headings.h1.fontFamily).toBe("CareJournalHeadingSemiBold");
    expect(TYPOGRAPHY.body.regular.fontFamily).toBe("CareJournalUI");
  });
});


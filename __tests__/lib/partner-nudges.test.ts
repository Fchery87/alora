import { describe, it, expect } from "vitest";
import {
  computePartnerNudges,
  shouldShowPartnerNudge,
} from "../../lib/partner-nudges";

describe("computePartnerNudges", () => {
  it("returns no nudges when fewer than 3 night feeds in last 24h", () => {
    const now = new Date(2026, 0, 25, 12, 0, 0);
    const n = computePartnerNudges({
      now,
      feeds: [
        {
          startTime: new Date(2026, 0, 25, 23, 0, 0).getTime(),
          createdById: "u1",
        },
        {
          startTime: new Date(2026, 0, 25, 1, 0, 0).getTime(),
          createdById: "u1",
        },
      ],
    });
    expect(n).toHaveLength(0);
  });

  it("returns a load-balance nudge when 3+ night feeds in last 24h by one user", () => {
    const now = new Date(2026, 0, 25, 12, 0, 0);
    const n = computePartnerNudges({
      now,
      feeds: [
        {
          startTime: new Date(2026, 0, 24, 23, 0, 0).getTime(),
          createdById: "u1",
        },
        {
          startTime: new Date(2026, 0, 25, 1, 0, 0).getTime(),
          createdById: "u1",
        },
        {
          startTime: new Date(2026, 0, 25, 5, 0, 0).getTime(),
          createdById: "u1",
        },
      ],
    });
    expect(n).toHaveLength(1);
    expect(n[0].kind).toBe("load_balance");
  });
});

describe("shouldShowPartnerNudge", () => {
  it("returns false when muted", () => {
    expect(
      shouldShowPartnerNudge({
        nudgeId: "x",
        nowMs: 100,
        mutedUntilMs: 200,
        lastShownAtMs: null,
        cooldownMs: 60_000,
      })
    ).toBe(false);
  });

  it("returns false when within cooldown", () => {
    expect(
      shouldShowPartnerNudge({
        nudgeId: "x",
        nowMs: 1000,
        mutedUntilMs: null,
        lastShownAtMs: 900,
        cooldownMs: 200,
      })
    ).toBe(false);
  });

  it("returns true when past cooldown", () => {
    expect(
      shouldShowPartnerNudge({
        nudgeId: "x",
        nowMs: 1200,
        mutedUntilMs: null,
        lastShownAtMs: 900,
        cooldownMs: 200,
      })
    ).toBe(true);
  });
});

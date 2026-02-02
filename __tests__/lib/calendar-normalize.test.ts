import { describe, it, expect } from "vitest";
import {
  normalizeAppointments,
  normalizeMedications,
} from "../../lib/calendar-normalize";

describe("calendar normalize", () => {
  it("normalizes appointments and drops invalid entries", () => {
    const appts = normalizeAppointments([
      {
        _id: "a1",
        title: "Checkup",
        type: "checkup",
        date: "2026-01-25",
        time: "09:00",
      },
      { _id: "bad" },
    ]);

    expect(appts).toHaveLength(1);
    expect(appts[0]._id).toBe("a1");
  });

  it("normalizes medications and drops invalid entries", () => {
    const meds = normalizeMedications([
      { _id: "m1", name: "Vitamin D", type: "supplement", isActive: true },
      { _id: "bad" },
    ]);

    expect(meds).toHaveLength(1);
    expect(meds[0]._id).toBe("m1");
  });
});

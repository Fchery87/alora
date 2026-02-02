import { describe, it, expect } from "vitest";
import { resetUserScopedStores } from "../../stores/reset";
import { useBabyStore } from "../../stores/babyStore";
import { usePartnerNudgeStore } from "../../stores/partnerNudgeStore";
import { useUIStore } from "../../stores/uiStore";

describe("resetUserScopedStores", () => {
  it("clears baby store state and ui selectedFamily", async () => {
    useBabyStore.setState((state) => ({
      ...state,
      selectedBabyId: "baby_1",
      babies: [
        {
          _id: "baby_1",
          _creationTime: 0,
          clerkOrganizationId: "org_1",
          name: "A",
          birthDate: 0,
          createdAt: 0,
          lastActiveAt: 0,
        } as any,
      ],
    }));

    useUIStore.setState((state) => ({
      ...state,
      selectedFamily: "org_1",
      isSidebarOpen: true,
    }));

    (useBabyStore as any).persist = { clearStorage: async () => {} };
    usePartnerNudgeStore.setState({
      mutedUntilMs: 123,
      lastShownAtMs: 456,
    } as any);

    await resetUserScopedStores();

    expect(useBabyStore.getState().selectedBabyId).toBeNull();
    expect(useBabyStore.getState().babies).toEqual([]);
    expect(useUIStore.getState().selectedFamily).toBeNull();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
    expect(usePartnerNudgeStore.getState().mutedUntilMs).toBeNull();
    expect(usePartnerNudgeStore.getState().lastShownAtMs).toBeNull();
  });
});

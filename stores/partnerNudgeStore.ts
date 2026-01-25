import { create } from "zustand";
import { persist } from "zustand/middleware";

type PartnerNudgeState = {
  mutedUntilMs: number | null;
  lastShownAtMs: number | null;
  actions: {
    muteForMs: (durationMs: number, nowMs?: number) => void;
    dismiss: (nowMs?: number) => void;
    clear: () => void;
  };
};

export const usePartnerNudgeStore = create<PartnerNudgeState>()(
  persist(
    (set) => ({
      mutedUntilMs: null,
      lastShownAtMs: null,
      actions: {
        muteForMs: (durationMs, nowMs = Date.now()) =>
          set({ mutedUntilMs: nowMs + durationMs, lastShownAtMs: nowMs }),
        dismiss: (nowMs = Date.now()) => set({ lastShownAtMs: nowMs }),
        clear: () => set({ mutedUntilMs: null, lastShownAtMs: null }),
      },
    }),
    { name: "alora-partner-nudge-store" }
  )
);

export function usePartnerNudgeState() {
  return usePartnerNudgeStore((s) => ({
    mutedUntilMs: s.mutedUntilMs,
    lastShownAtMs: s.lastShownAtMs,
  }));
}

export function usePartnerNudgeActions() {
  return usePartnerNudgeStore((s) => s.actions);
}

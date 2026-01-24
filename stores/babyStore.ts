import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Baby {
  _id: string;
  _creationTime: number;
  clerkOrganizationId: string;
  name: string;
  birthDate: number;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  createdAt: number;
}

interface BabyState {
  selectedBabyId: string | null;
  babies: Baby[];
  actions: {
    selectBaby: (id: string | null) => void;
    setBabies: (babies: Baby[]) => void;
    addBaby: (baby: Baby) => void;
    clearBabies: () => void;
  };
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set) => ({
      selectedBabyId: null,
      babies: [],
      actions: {
        selectBaby: (id) => set({ selectedBabyId: id }),
        setBabies: (babies) => set({ babies }),
        addBaby: (baby) =>
          set((state) => ({ babies: [...state.babies, baby] })),
        clearBabies: () => set({ babies: [], selectedBabyId: null }),
      },
    }),
    {
      name: "alora-baby-store",
      partialize: (state) => ({
        selectedBabyId: state.selectedBabyId,
      }),
    }
  )
);

// Convenience hooks
export function useSelectedBabyId() {
  return useBabyStore((state) => state.selectedBabyId);
}

export function useBabies() {
  return useBabyStore((state) => state.babies);
}

export function useSelectedBabyData() {
  const selectedBabyId = useSelectedBabyId();
  const babies = useBabies();
  return babies.find((baby) => baby._id === selectedBabyId) || null;
}

export function useBabyActions() {
  return useBabyStore((state) => state.actions);
}

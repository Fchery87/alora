import { create } from "zustand";

interface UIState {
  selectedBaby: string | null;
  selectedFamily: string | null;
  theme: "light" | "dark" | "auto";
  isSidebarOpen: boolean;
  actions: {
    setSelectedBaby: (id: string | null) => void;
    setSelectedFamily: (id: string | null) => void;
    setTheme: (theme: "light" | "dark" | "auto") => void;
    toggleSidebar: () => void;
  };
}

export const useUIStore = create<UIState>((set) => ({
  selectedBaby: null,
  selectedFamily: null,
  theme: "auto",
  isSidebarOpen: false,

  actions: {
    setSelectedBaby: (id) => set({ selectedBaby: id }),
    setSelectedFamily: (id) => set({ selectedFamily: id }),
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  },
}));

export function useSelectedBaby() {
  return useUIStore((state) => state.selectedBaby);
}

export function useSelectedFamily() {
  return useUIStore((state) => state.selectedFamily);
}

export function useTheme() {
  return useUIStore((state) => state.theme);
}

export function useUIActions() {
  return useUIStore((state) => state.actions);
}

import { create } from "zustand";

interface UIState {
  selectedFamily: string | null;
  theme: "light" | "dark" | "auto";
  isSidebarOpen: boolean;
  actions: {
    setSelectedFamily: (id: string | null) => void;
    setTheme: (theme: "light" | "dark" | "auto") => void;
    toggleSidebar: () => void;
  };
}

export const useUIStore = create<UIState>((set) => ({
  selectedFamily: null,
  theme: "auto",
  isSidebarOpen: false,

  actions: {
    setSelectedFamily: (id) => set({ selectedFamily: id }),
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  },
}));

export function useSelectedFamily() {
  return useUIStore((state) => state.selectedFamily);
}

export function useTheme() {
  return useUIStore((state) => state.theme);
}

export function useUIActions() {
  return useUIStore((state) => state.actions);
}

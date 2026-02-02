import { useBabyStore } from "./babyStore";
import { usePartnerNudgeStore } from "./partnerNudgeStore";
import { useUIStore } from "./uiStore";

export async function resetUserScopedStores() {
  useBabyStore.getState().actions.clearBabies();
  useUIStore.setState((state) => ({
    ...state,
    selectedFamily: null,
    isSidebarOpen: false,
  }));
  usePartnerNudgeStore.getState().actions.clear();

  const babyPersist = (useBabyStore as any).persist;
  if (babyPersist?.clearStorage) {
    await babyPersist.clearStorage();
  }
}

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBabyStore } from "@/stores/babyStore";
import { useAuth } from "@clerk/clerk-expo";

export interface Baby {
  _id: string;
  _creationTime: number;
  clerkOrganizationId: string;
  name: string;
  birthDate: number;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  createdAt: number;
  age?: string;
}

/**
 * Hook to fetch babies from Convex and manage baby selection
 */
export function useBaby() {
  const { userId, orgId, isLoaded } = useAuth();
  const selectedBabyId = useBabyStore((state) => state.selectedBabyId);
  const babies = useBabyStore((state) => state.babies);

  // Fetch babies from Convex
  const fetchedBabies = useQuery(
    api.functions.babies.index.listByOrganization,
    isLoaded && userId && orgId ? {} : "skip"
  );

  useEffect(() => {
    if (fetchedBabies && Array.isArray(fetchedBabies)) {
      // Update store with fetched babies using getState() to avoid unstable reference
      useBabyStore.getState().actions.setBabies(fetchedBabies);

      // Auto-select first baby if none selected and babies exist
      if (!selectedBabyId && fetchedBabies.length > 0) {
        useBabyStore.getState().actions.selectBaby(fetchedBabies[0]._id);
      }
    }
  }, [fetchedBabies, selectedBabyId]);

  // Calculate age helper function
  const calculateAge = (birthDate: number) => {
    const now = Date.now();
    const diff = now - birthDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    if (days < 30) {
      return `${days}d`;
    } else if (months < 12) {
      return `${months}m ${remainingDays}d`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years}y ${remainingMonths}m`;
    }
  };

  // Get current baby with age
  const selectedBaby = babies.find((b) => b._id === selectedBabyId) || null;
  const selectedBabyWithAge = selectedBaby
    ? { ...selectedBaby, age: calculateAge(selectedBaby.birthDate) }
    : null;

  // Access actions from store for return (stable functions won't cause infinite loop)
  const selectBaby = (id: string) =>
    useBabyStore.getState().actions.selectBaby(id);
  const setBabies = (babies: Baby[]) =>
    useBabyStore.getState().actions.setBabies(babies);
  const addBaby = (baby: Baby) => useBabyStore.getState().actions.addBaby(baby);

  return {
    babies,
    selectedBabyId,
    selectedBaby: selectedBabyWithAge,
    selectBaby,
    setBabies,
    addBaby,
    calculateAge,
    isLoading: fetchedBabies === undefined,
  };
}

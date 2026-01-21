import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export interface Milestone {
  id: string;
  babyId: string;
  title: string;
  description?: string;
  category: "motor" | "cognitive" | "language" | "social" | "custom";
  date?: string;
  ageMonths?: number;
  isCustom: boolean;
  isCelebrated: boolean;
  photoUrl?: string;
  createdAt: string;
}

const milestonesApi = (api as any).milestones;

export function useListMilestones(babyId: string) {
  const milestones = useQuery(milestonesApi.list, { babyId });
  return {
    data: milestones as Milestone[] | undefined,
    isLoading: milestones === undefined,
    error: milestones === null ? new Error("Failed to fetch milestones") : null,
  };
}

export function useMilestone(milestoneId: Id<"milestones">) {
  const milestone = useQuery(milestonesApi.get, { id: milestoneId });
  return {
    data: milestone as Milestone | undefined,
    isLoading: milestone === undefined,
    error: milestone === null ? new Error("Failed to fetch milestone") : null,
  };
}

export function useCreateMilestone() {
  return useMutation(milestonesApi.create);
}

export function useUpdateMilestone() {
  return useMutation(milestonesApi.update);
}

export function useDeleteMilestone() {
  return useMutation(milestonesApi.remove);
}

export function useCelebrateMilestone() {
  return useMutation(milestonesApi.celebrate);
}

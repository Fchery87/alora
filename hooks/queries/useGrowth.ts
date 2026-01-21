import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export interface GrowthMeasurement {
  id: string;
  babyId: string;
  type: "weight" | "length" | "head_circumference";
  value: number;
  unit: string;
  date: string;
  notes?: string;
  percentile?: number;
  createdAt: string;
  updatedAt: string;
}

const growthApi = (api as any).growth;

export function useListGrowth(babyId: string) {
  const growthData = useQuery(growthApi.list, { babyId });
  return {
    data: growthData as GrowthMeasurement[] | undefined,
    isLoading: growthData === undefined,
    error:
      growthData === null ? new Error("Failed to fetch growth data") : null,
  };
}

export function useGrowth(growthId: Id<"growth">) {
  const growth = useQuery(growthApi.get, { id: growthId });
  return {
    data: growth as GrowthMeasurement | undefined,
    isLoading: growth === undefined,
    error:
      growth === null ? new Error("Failed to fetch growth measurement") : null,
  };
}

export function useCreateGrowth() {
  return useMutation(growthApi.create);
}

export function useUpdateGrowth() {
  return useMutation(growthApi.update);
}

export function useDeleteGrowth() {
  return useMutation(growthApi.remove);
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

const wellnessApi = (api as any).wellness as any;

export function useCreateMood() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => convex.mutation(wellnessApi.createMood, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}

export function useListMood(dateRange?: { start: number; end: number }) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["mood", dateRange],
    queryFn: () =>
      convex.query(wellnessApi.listMood, {
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMood(id: string) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["mood", id],
    queryFn: () => convex.query(wellnessApi.getMood, { id }),
    enabled: !!id,
  });
}

export function useMoodTrends(days?: number) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["moodTrends", days],
    queryFn: () => convex.query(wellnessApi.getMoodTrends, { days }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteMood() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => convex.mutation(wellnessApi.deleteMood, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}

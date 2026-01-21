import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";

const wellnessApi = (api as any).wellness;

export function useCreateMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => wellnessApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}

export function useListMood(dateRange?: { start: number; end: number }) {
  return useQuery({
    queryKey: ["mood", dateRange],
    queryFn: () =>
      wellnessApi.list({
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMood(id: string) {
  return useQuery({
    queryKey: ["mood", id],
    queryFn: () => wellnessApi.get({ id }),
    enabled: !!id,
  });
}

export function useMoodTrends(days?: number) {
  return useQuery({
    queryKey: ["moodTrends", days],
    queryFn: () => wellnessApi.getTrends({ days }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wellnessApi.delete({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}

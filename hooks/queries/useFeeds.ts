import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type FeedsApi = {
  listFeeds: (args: {
    babyId: string;
    startDate?: number;
    endDate?: number;
  }) => Promise<any>;
  createFeed: (args: any) => Promise<any>;
  getFeed: (args: { id: string }) => Promise<any>;
  updateFeed: (args: any) => Promise<any>;
  deleteFeed: (args: { id: string }) => Promise<any>;
};

const feedsApi = (api as any).feeds as FeedsApi;

export function useFeeds(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  return useQuery({
    queryKey: ["feeds", babyId, dateRange],
    queryFn: () =>
      feedsApi.listFeeds({
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      type: "breast" | "formula" | "solid";
      side?: "left" | "right" | "both";
      amount?: string;
      duration?: number;
      startTime: number;
      endTime?: number;
      notes?: string;
    }) => feedsApi.createFeed(data),
    onMutate: async (newFeed) => {
      await queryClient.cancelQueries({ queryKey: ["feeds"] });

      const previousFeeds = queryClient.getQueryData(["feeds", newFeed.babyId]);

      queryClient.setQueryData(["feeds", newFeed.babyId], (old: any[]) => [
        { ...newFeed, _id: "temp-id" as Id<"feeds">, createdAt: Date.now() },
        ...(old || []),
      ]);

      return { previousFeeds };
    },
    onError: (err, newFeed, context) => {
      queryClient.setQueryData(
        ["feeds", newFeed.babyId],
        context?.previousFeeds
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
}

export function useFeed(id: string) {
  return useQuery({
    queryKey: ["feed", id],
    queryFn: () => feedsApi.getFeed({ id }),
    enabled: !!id,
  });
}

export function useUpdateFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Id<"feeds">;
      data: Partial<{
        type: "breast" | "formula" | "solid";
        side?: "left" | "right" | "both";
        amount?: string;
        duration?: number;
        endTime?: number;
        notes?: string;
      }>;
    }) => feedsApi.updateFeed({ id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["feed", id] });
    },
  });
}

export function useDeleteFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"feeds">) => feedsApi.deleteFeed({ id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["feed", id] });
    },
  });
}

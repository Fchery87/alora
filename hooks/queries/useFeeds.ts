import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
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

const feedsApi = (api as any).feeds as any;

export function useFeeds(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  const convex = useConvex();
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });
  return useQuery({
    queryKey: ["feeds", babyId, dateRange],
    queryFn: () =>
      convex.query(feedsApi.listFeeds, {
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(babyId) && isLoaded && Boolean(isSignedIn),
  });
}

export function useCreateFeed() {
  const convex = useConvex();
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
    }) => convex.mutation(feedsApi.createFeed, data),
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
  const convex = useConvex();
  return useQuery({
    queryKey: ["feed", id],
    queryFn: () => convex.query(feedsApi.getFeed, { id }),
    enabled: !!id,
  });
}

export function useUpdateFeed() {
  const convex = useConvex();
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
    }) => convex.mutation(feedsApi.updateFeed, { id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["feed", id] });
    },
  });
}

export function useDeleteFeed() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"feeds">) => convex.mutation(feedsApi.deleteFeed, { id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["feed", id] });
    },
  });
}

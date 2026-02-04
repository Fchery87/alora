import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type SleepApi = {
  createSleep: (args: any) => Promise<any>;
  listSleep: (args: {
    babyId: string;
    startDate?: number;
    endDate?: number;
  }) => Promise<any>;
  getSleep: (args: { id: string }) => Promise<any>;
  updateSleep: (args: any) => Promise<any>;
  deleteSleep: (args: { id: string }) => Promise<any>;
};

const sleepApi = (api as any).sleep as any;

export function useCreateSleep() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      type: "nap" | "night" | "day";
      startTime: number;
      endTime?: number;
      duration?: number;
      quality?: "awake" | "drowsy" | "sleeping" | "deep";
      notes?: string;
    }) => convex.mutation(sleepApi.createSleep, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", variables.babyId] });
    },
  });
}

export function useListSleep(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["sleep", babyId, dateRange],
    queryFn: () =>
      convex.query(sleepApi.listSleep, {
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(babyId),
  });
}

export function useSleep(id: string) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["sleep", id],
    queryFn: () => convex.query(sleepApi.getSleep, { id }),
    enabled: !!id,
  });
}

export function useUpdateSleep() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Id<"sleep">;
      data: Partial<{
        startTime?: number;
        type?: "nap" | "night" | "day";
        endTime?: number;
        duration?: number;
        quality?: "awake" | "drowsy" | "sleeping" | "deep";
        notes?: string;
      }>;
    }) => convex.mutation(sleepApi.updateSleep, { id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", id] });
    },
  });
}

export function useDeleteSleep() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"sleep">) => convex.mutation(sleepApi.deleteSleep, { id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", id] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const sleepApi = (api as any).sleep as SleepApi;

export function useCreateSleep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      startTime: number;
      endTime?: number;
      quality?: number;
      notes?: string;
    }) => sleepApi.createSleep(data),
    onSuccess: (_, babyId) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", babyId] });
    },
  });
}

export function useListSleep(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  return useQuery({
    queryKey: ["sleep", babyId, dateRange],
    queryFn: () =>
      sleepApi.listSleep({
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSleep(id: string) {
  return useQuery({
    queryKey: ["sleep", id],
    queryFn: () => sleepApi.getSleep({ id }),
    enabled: !!id,
  });
}

export function useUpdateSleep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Id<"sleep">;
      data: Partial<{ endTime?: number; quality?: number; notes?: string }>;
    }) => sleepApi.updateSleep({ id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", id] });
    },
  });
}

export function useDeleteSleep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"sleep">) => sleepApi.deleteSleep({ id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sleep", id] });
    },
  });
}

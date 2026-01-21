import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type DiapersApi = {
  createDiaper: (args: any) => Promise<any>;
  listDiapers: (args: {
    babyId: string;
    startDate?: number;
    endDate?: number;
  }) => Promise<any>;
  getDiaper: (args: { id: string }) => Promise<any>;
  updateDiaper: (args: any) => Promise<any>;
  deleteDiaper: (args: { id: string }) => Promise<any>;
};

const diapersApi = (api as any).diapers as DiapersApi;

export function useCreateDiaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      type: "solid" | "wet" | "mixed";
      color?: "yellow" | "orange" | "green" | "brown" | "red";
      notes?: string;
      startTime: number;
      endTime?: number;
    }) => diapersApi.createDiaper(data),
    onSuccess: (_, babyId) => {
      queryClient.invalidateQueries({ queryKey: ["diapers", babyId] });
    },
  });
}

export function useListDiapers(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  return useQuery({
    queryKey: ["diapers", babyId, dateRange],
    queryFn: () =>
      diapersApi.listDiapers({
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDiaper(id: string) {
  return useQuery({
    queryKey: ["diaper", id],
    queryFn: () => diapersApi.getDiaper({ id }),
    enabled: !!id,
  });
}

export function useUpdateDiaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Id<"diapers">;
      data: Partial<{
        type: "solid" | "wet" | "mixed";
        color?: "yellow" | "orange" | "green" | "brown" | "red";
        notes?: string;
        endTime?: number;
      }>;
    }) => diapersApi.updateDiaper({ id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["diaper", id] });
    },
  });
}

export function useDeleteDiaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"diapers">) => diapersApi.deleteDiaper({ id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["diaper", id] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
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

const diapersApi = (api as any).diapers as any;

export function useCreateDiaper() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      type: "solid" | "wet" | "mixed";
      color?: "yellow" | "orange" | "green" | "brown" | "red";
      notes?: string;
      startTime: number;
      endTime?: number;
    }) => convex.mutation(diapersApi.createDiaper, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diapers", variables.babyId] });
    },
  });
}

export function useListDiapers(
  babyId: string,
  dateRange?: { start: number; end: number }
) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["diapers", babyId, dateRange],
    queryFn: () =>
      convex.query(diapersApi.listDiapers, {
        babyId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(babyId),
  });
}

export function useDiaper(id: string) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["diaper", id],
    queryFn: () => convex.query(diapersApi.getDiaper, { id }),
    enabled: !!id,
  });
}

export function useUpdateDiaper() {
  const convex = useConvex();
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
    }) => convex.mutation(diapersApi.updateDiaper, { id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["diaper", id] });
    },
  });
}

export function useDeleteDiaper() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"diapers">) => convex.mutation(diapersApi.deleteDiaper, { id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["diaper", id] });
    },
  });
}

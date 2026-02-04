import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

const journalApi = (api as any).journal as any;

export function useCreateJournal() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => convex.mutation(journalApi.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useListJournal(
  dateRange?: { start: number; end: number },
  tags?: string[]
) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["journal", dateRange, tags],
    queryFn: () =>
      convex.query(journalApi.list, {
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        tags,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useJournal(id: string) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => convex.query(journalApi.get, { id }),
    enabled: !!id,
  });
}

export function useUpdateJournal() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      convex.mutation(journalApi.update, { id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["journal", id] });
    },
  });
}

export function useDeleteJournal() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => convex.mutation(journalApi.delete, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

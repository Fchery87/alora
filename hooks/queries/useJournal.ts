import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";

const journalApi = (api as any).journal;

export function useCreateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => journalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useListJournal(
  dateRange?: { start: number; end: number },
  tags?: string[]
) {
  return useQuery({
    queryKey: ["journal", dateRange, tags],
    queryFn: () =>
      journalApi.list({
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        tags,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useJournal(id: string) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => journalApi.get({ id }),
    enabled: !!id,
  });
}

export function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      journalApi.update({ id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["journal", id] });
    },
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalApi.delete({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

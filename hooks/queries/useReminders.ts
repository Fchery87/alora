import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type RemindersApi = {
  list: (args: { babyId: Id<"babies">; limit?: number }) => Promise<any>;
  getByUser: (args: { userId: Id<"users">; limit?: number }) => Promise<any>;
  get: (args: { id: Id<"reminders"> }) => Promise<any>;
  create: (args: {
    babyId: Id<"babies">;
    type: "feeding" | "sleep" | "diaper" | "custom";
    title: string;
    message?: string;
    intervalMinutes?: number;
    specificTime?: string;
    daysOfWeek?: number[];
    isEnabled?: boolean;
  }) => Promise<Id<"reminders">>;
  update: (args: {
    id: Id<"reminders">;
    title?: string;
    message?: string;
    intervalMinutes?: number;
    specificTime?: string;
    daysOfWeek?: number[];
    isEnabled?: boolean;
  }) => Promise<void>;
  toggleEnabled: (args: { id: Id<"reminders"> }) => Promise<void>;
  remove: (args: { id: Id<"reminders"> }) => Promise<void>;
};

const remindersApi = (api as any).reminders as any;

export function useReminders(babyId: Id<"babies">) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["reminders", babyId],
    queryFn: () => convex.query(remindersApi.list, { babyId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(babyId),
  });
}

export function useRemindersByUser(userId: Id<"users">) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["reminders", userId],
    queryFn: () => convex.query(remindersApi.getByUser, { userId }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId),
  });
}

export function useReminder(id: string) {
  const convex = useConvex();
  return useQuery({
    queryKey: ["reminder", id],
    queryFn: () => convex.query(remindersApi.get, { id: id as Id<"reminders"> }),
    enabled: !!id,
  });
}

export function useCreateReminder() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      babyId: Id<"babies">;
      type: "feeding" | "sleep" | "diaper" | "custom";
      title: string;
      message?: string;
      intervalMinutes?: number;
      specificTime?: string;
      daysOfWeek?: number[];
    }) => convex.mutation(remindersApi.create, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reminders", variables.babyId],
      });
    },
  });
}

export function useUpdateReminder() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Id<"reminders">;
      data: Partial<{
        title: string;
        message: string;
        intervalMinutes: number;
        specificTime: string;
        daysOfWeek: number[];
        isEnabled: boolean;
      }>;
    }) => convex.mutation(remindersApi.update, { id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reminder", id] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useToggleReminder() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"reminders">) =>
      convex.mutation(remindersApi.toggleEnabled, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"reminders">) => convex.mutation(remindersApi.remove, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

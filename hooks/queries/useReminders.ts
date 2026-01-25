import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const remindersApi = (api as any).reminders as RemindersApi;

export function useReminders(babyId: Id<"babies">) {
  return useQuery({
    queryKey: ["reminders", babyId],
    queryFn: () => remindersApi.list({ babyId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRemindersByUser(userId: Id<"users">) {
  return useQuery({
    queryKey: ["reminders", userId],
    queryFn: () => remindersApi.getByUser({ userId }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReminder(id: string) {
  return useQuery({
    queryKey: ["reminder", id],
    queryFn: () => remindersApi.get({ id: id as Id<"reminders"> }),
    enabled: !!id,
  });
}

export function useCreateReminder() {
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
    }) => remindersApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reminders", variables.babyId],
      });
    },
  });
}

export function useUpdateReminder() {
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
    }) => remindersApi.update({ id, ...data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reminder", id] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useToggleReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"reminders">) => remindersApi.toggleEnabled({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id<"reminders">) => remindersApi.remove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

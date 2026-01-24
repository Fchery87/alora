import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useAppointments(
  clerkOrganizationId: string,
  babyId?: Id<"babies">,
  startDate?: string,
  endDate?: string
) {
  return useQuery(api.functions.appointments.index.listAppointments, {
    clerkOrganizationId,
    babyId,
    startDate,
    endDate,
  });
}

export function useAppointment(appointmentId: Id<"appointments">) {
  return useQuery(api.functions.appointments.index.getAppointment, { appointmentId });
}

export function useCreateAppointment() {
  return useMutation(api.functions.appointments.index.createAppointment);
}

export function useUpdateAppointment() {
  return useMutation(api.functions.appointments.index.updateAppointment);
}

export function useDeleteAppointment() {
  return useMutation(api.functions.appointments.index.deleteAppointment);
}

export function useCompleteAppointment() {
  return useMutation(api.functions.appointments.index.completeAppointment);
}

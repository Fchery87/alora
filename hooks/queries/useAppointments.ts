import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useAppointments(
  clerkOrganizationId: string,
  babyId?: Id<"babies">,
  startDate?: string,
  endDate?: string
) {
  return useQuery(api.appointments.listAppointments, {
    clerkOrganizationId,
    babyId,
    startDate,
    endDate,
  });
}

export function useAppointment(appointmentId: Id<"appointments">) {
  return useQuery(api.appointments.getAppointment, { appointmentId });
}

export function useCreateAppointment() {
  return useMutation(api.appointments.createAppointment);
}

export function useUpdateAppointment() {
  return useMutation(api.appointments.updateAppointment);
}

export function useDeleteAppointment() {
  return useMutation(api.appointments.deleteAppointment);
}

export function useCompleteAppointment() {
  return useMutation(api.appointments.completeAppointment);
}

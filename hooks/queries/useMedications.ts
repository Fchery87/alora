import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useMedications(
  clerkOrganizationId: string,
  babyId?: Id<"babies">
) {
  return useQuery(api.medications.listMedications, {
    clerkOrganizationId,
    babyId,
  });
}

export function useActiveMedications(
  clerkOrganizationId: string,
  babyId?: Id<"babies">
) {
  return useQuery(api.medications.listMedications, {
    clerkOrganizationId,
    babyId,
    isActive: true,
  });
}

export function useMedication(medicationId: Id<"medications">) {
  return useQuery(api.medications.getMedication, { medicationId });
}

export function useCreateMedication() {
  return useMutation(api.medications.createMedication);
}

export function useUpdateMedication() {
  return useMutation(api.medications.updateMedication);
}

export function useDeleteMedication() {
  return useMutation(api.medications.deleteMedication);
}

export function useToggleMedicationActive() {
  return useMutation(api.medications.toggleMedicationActive);
}

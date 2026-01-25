import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useMedications(
  clerkOrganizationId: string | undefined,
  babyId?: Id<"babies">
) {
  return useQuery(
    api.functions.medications.index.listMedications,
    clerkOrganizationId
      ? {
          clerkOrganizationId,
          babyId,
        }
      : "skip"
  );
}

export function useActiveMedications(
  clerkOrganizationId: string | undefined,
  babyId?: Id<"babies">
) {
  return useQuery(
    api.functions.medications.index.listMedications,
    clerkOrganizationId
      ? {
          clerkOrganizationId,
          babyId,
          isActive: true,
        }
      : "skip"
  );
}

export function useMedication(medicationId: Id<"medications">) {
  return useQuery(api.functions.medications.index.getMedication, {
    medicationId,
  });
}

export function useCreateMedication() {
  return useMutation(api.functions.medications.index.createMedication);
}

export function useUpdateMedication() {
  return useMutation(api.functions.medications.index.updateMedication);
}

export function useDeleteMedication() {
  return useMutation(api.functions.medications.index.deleteMedication);
}

export function useToggleMedicationActive() {
  return useMutation(api.functions.medications.index.toggleMedicationActive);
}

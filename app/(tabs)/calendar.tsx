import { View, Text, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/organisms/CalendarView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import {
  useAppointments,
  useCreateAppointment,
} from "@/hooks/queries/useAppointments";
import { useSelectedBabyId } from "@/stores/babyStore";
import type { Id } from "convex/_generated/dataModel";
import {
  normalizeAppointments,
  normalizeMedications,
} from "@/lib/calendar-normalize";
import { useState } from "react";
import {
  AppointmentForm,
  type AppointmentFormData,
  MedicationForm,
  type MedicationFormData,
} from "@/components/organisms/forms";
import {
  useCreateMedication,
  useActiveMedications as useActiveMedicationsQuery,
} from "@/hooks/queries/useMedications";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import { COLORS } from "@/lib/theme";

export default function CalendarScreen() {
  const { isSignedIn, orgId, isLoaded } = useAuth();
  const selectedBabyId = useSelectedBabyId();
  const babyId = (selectedBabyId ?? undefined) as Id<"babies"> | undefined;
  const clerkOrganizationId = orgId ?? undefined;
  const appointments = useAppointments(clerkOrganizationId, babyId);
  const medications = useActiveMedicationsQuery(clerkOrganizationId, babyId);
  const createAppointment = useCreateAppointment();
  const createMedication = useCreateMedication();

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const closeModals = () => {
    setShowAppointmentModal(false);
    setShowMedicationModal(false);
    setFormError(null);
  };

  const handleCreateAppointment = async (data: AppointmentFormData) => {
    if (!clerkOrganizationId) return;
    setIsSaving(true);
    setFormError(null);
    try {
      await createAppointment({
        clerkOrganizationId,
        babyId,
        title: data.title,
        type: data.type,
        date: data.date,
        time: data.time,
        location: data.location || undefined,
        notes: data.notes || undefined,
        reminderMinutesBefore: data.reminderEnabled
          ? data.reminderMinutesBefore
          : undefined,
      } as any);
      closeModals();
    } catch (e: any) {
      setFormError(e?.message || "Failed to create appointment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMedication = async (data: MedicationFormData) => {
    if (!clerkOrganizationId) return;
    setIsSaving(true);
    setFormError(null);
    try {
      await createMedication({
        clerkOrganizationId,
        babyId,
        name: data.name,
        type: data.type,
        dosage: data.dosage || undefined,
        frequency: data.frequency || undefined,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        notes: data.notes || undefined,
        reminderEnabled: data.reminderEnabled,
        reminderTimes: data.reminderTimes,
      } as any);
      closeModals();
    } catch (e: any) {
      setFormError(e?.message || "Failed to create medication.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OrganicBackground>
      <View style={styles.screen}>
        <Header title="Calendar" showBackButton={false} />
        {isLoaded && !orgId ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Please select a family to view calendar items.
            </Text>
          </View>
        ) : orgId &&
          (appointments === undefined || medications === undefined) ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.terracotta} />
            <Text style={styles.loadingText}>Loading calendar…</Text>
          </View>
        ) : (
          <CalendarView
            appointments={normalizeAppointments(appointments)}
            medications={normalizeMedications(medications)}
            onAddAppointment={() => {
              setFormError(null);
              setShowAppointmentModal(true);
            }}
            onAddMedication={() => {
              setFormError(null);
              setShowMedicationModal(true);
            }}
          />
        )}

        <Modal
          visible={showAppointmentModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModals}
        >
          <View style={styles.modal}>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            {isSaving ? (
              <View style={styles.saving}>
                <ActivityIndicator size="large" color={COLORS.terracotta} />
                <Text style={styles.loadingText}>Saving…</Text>
              </View>
            ) : (
              <AppointmentForm
                onSubmit={handleCreateAppointment}
                onCancel={closeModals}
              />
            )}
          </View>
        </Modal>

        <Modal
          visible={showMedicationModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModals}
        >
          <View style={styles.modal}>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            {isSaving ? (
              <View style={styles.saving}>
                <ActivityIndicator size="large" color={COLORS.terracotta} />
                <Text style={styles.loadingText}>Saving…</Text>
              </View>
            ) : (
              <MedicationForm
                onSubmit={handleCreateMedication}
                onCancel={closeModals}
              />
            )}
          </View>
        </Modal>
      </View>
    </OrganicBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  notice: {
    padding: 16,
  },
  noticeText: {
    color: COLORS.warmDark,
    fontSize: 14,
    fontFamily: "CareJournalUI",
  },
  loading: {
    padding: 16,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: COLORS.warmDark,
    marginTop: 12,
    fontSize: 14,
    fontFamily: "CareJournalUI",
  },
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.cream,
  },
  formError: {
    color: COLORS.danger,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "CareJournalUI",
  },
  saving: {
    paddingVertical: 24,
    alignItems: "center",
  },
});

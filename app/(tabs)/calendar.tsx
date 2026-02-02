import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/organisms/CalendarView";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useAppointments } from "@/hooks/queries/useAppointments";
import { useActiveMedications } from "@/hooks/queries/useMedications";
import { useSelectedBabyId } from "@/stores/babyStore";
import type { Id } from "convex/_generated/dataModel";

export default function CalendarScreen() {
  const { isSignedIn, orgId, isLoaded } = useAuth();
  const selectedBabyId = useSelectedBabyId();
  const babyId = (selectedBabyId ?? undefined) as Id<"babies"> | undefined;
  const clerkOrganizationId = orgId ?? undefined;
  const appointments = useAppointments(clerkOrganizationId, babyId);
  const medications = useActiveMedications(clerkOrganizationId, babyId);
  // auth bypass removed

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Header title="Calendar" showBackButton={false} />
      {isLoaded && !orgId ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Please select a family to view calendar items.
          </Text>
        </View>
      ) : (
        <CalendarView
          appointments={appointments ?? []}
          medications={medications ?? []}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 16,
  },
  messageText: {
    color: "#6b7280",
  },
});

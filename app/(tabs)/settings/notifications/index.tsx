import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [appointmentLeadTime, setAppointmentLeadTime] = useState(60);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [selfCareReminders, setSelfCareReminders] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart] = useState("22:00");
  const [quietHoursEnd] = useState("07:00");

  const LEAD_TIME_OPTIONS = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 1440, label: "1 day" },
  ];

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Ionicons name="notifications" size={22} color="#6366f1" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Text style={styles.sublabel}>Receive push notifications</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#e2e8f0", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {pushEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reminder Types</Text>

              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <Ionicons name="calendar" size={22} color="#3b82f6" />
                  <View style={styles.textContent}>
                    <Text style={styles.label}>Appointment Reminders</Text>
                    <Text style={styles.sublabel}>Never miss a visit</Text>
                  </View>
                </View>
                <Switch
                  value={appointmentReminders}
                  onValueChange={setAppointmentReminders}
                  trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
                  thumbColor="#fff"
                />
              </View>

              {appointmentReminders && (
                <View style={styles.subRow}>
                  <Text style={styles.subLabel}>Remind me</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {LEAD_TIME_OPTIONS.map((option) => (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.chip,
                          appointmentLeadTime === option.value &&
                            styles.chipActive,
                        ]}
                        onPress={() => setAppointmentLeadTime(option.value)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            appointmentLeadTime === option.value &&
                              styles.chipTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={[styles.row, styles.rowBorder]}>
                <View style={styles.rowContent}>
                  <Ionicons name="medical" size={22} color="#22c55e" />
                  <View style={styles.textContent}>
                    <Text style={styles.label}>Medication Reminders</Text>
                    <Text style={styles.sublabel}>
                      Track medications on time
                    </Text>
                  </View>
                </View>
                <Switch
                  value={medicationReminders}
                  onValueChange={setMedicationReminders}
                  trackColor={{ false: "#e2e8f0", true: "#22c55e" }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.row, styles.rowBorder]}>
                <View style={styles.rowContent}>
                  <Ionicons name="heart" size={22} color="#ec4899" />
                  <View style={styles.textContent}>
                    <Text style={styles.label}>Self-Care Nudges</Text>
                    <Text style={styles.sublabel}>
                      Gentle reminders for you
                    </Text>
                  </View>
                </View>
                <Switch
                  value={selfCareReminders}
                  onValueChange={setSelfCareReminders}
                  trackColor={{ false: "#e2e8f0", true: "#ec4899" }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quiet Hours</Text>

              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <Ionicons name="moon" size={22} color="#8b5cf6" />
                  <View style={styles.textContent}>
                    <Text style={styles.label}>Quiet Hours</Text>
                    <Text style={styles.sublabel}>
                      Silence notifications at night
                    </Text>
                  </View>
                </View>
                <Switch
                  value={quietHoursEnabled}
                  onValueChange={setQuietHoursEnabled}
                  trackColor={{ false: "#e2e8f0", true: "#8b5cf6" }}
                  thumbColor="#fff"
                />
              </View>

              {quietHoursEnabled && (
                <View style={styles.timeRow}>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeLabel}>From</Text>
                    <View style={styles.timeInput}>
                      <Ionicons name="time" size={18} color="#64748b" />
                      <Text style={styles.timeValue}>{quietHoursStart}</Text>
                    </View>
                  </View>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeLabel}>To</Text>
                    <View style={styles.timeInput}>
                      <Ionicons name="time" size={18} color="#64748b" />
                      <Text style={styles.timeValue}>{quietHoursEnd}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    marginTop: 8,
    paddingTop: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  sublabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  subRow: {
    marginLeft: 34,
    marginTop: 8,
  },
  subLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#6366f1",
  },
  chipText: {
    fontSize: 14,
    color: "#64748b",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  timeRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    marginLeft: 34,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  timeValue: {
    fontSize: 16,
    color: "#0f172a",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

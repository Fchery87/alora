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
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

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

  const getIconColor = (index: number) => {
    const colors = [COLORS.terracotta, COLORS.sage, COLORS.gold, COLORS.clay];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.terracotta}15` },
                ]}
              >
                <Ionicons
                  name="notifications"
                  size={22}
                  color={COLORS.terracotta}
                />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Text style={styles.sublabel}>Receive push notifications</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
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
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${COLORS.sage}15` },
                    ]}
                  >
                    <Ionicons name="calendar" size={22} color={COLORS.sage} />
                  </View>
                  <View style={styles.textContent}>
                    <Text style={styles.label}>Appointment Reminders</Text>
                    <Text style={styles.sublabel}>Never miss a visit</Text>
                  </View>
                </View>
                <Switch
                  value={appointmentReminders}
                  onValueChange={setAppointmentReminders}
                  trackColor={{ false: "#E8DED1", true: COLORS.sage }}
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
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${COLORS.gold}15` },
                    ]}
                  >
                    <Ionicons name="medical" size={22} color={COLORS.gold} />
                  </View>
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
                  trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.row, styles.rowBorder]}>
                <View style={styles.rowContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${COLORS.clay}15` },
                    ]}
                  >
                    <Ionicons name="heart" size={22} color={COLORS.clay} />
                  </View>
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
                  trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quiet Hours</Text>

              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${COLORS.stone}15` },
                    ]}
                  >
                    <Ionicons name="moon" size={22} color={COLORS.stone} />
                  </View>
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
                  trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                  thumbColor="#fff"
                />
              </View>

              {quietHoursEnabled && (
                <View style={styles.timeRow}>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeLabel}>From</Text>
                    <View style={styles.timeInput}>
                      <Ionicons name="time" size={18} color={TEXT.tertiary} />
                      <Text style={styles.timeValue}>{quietHoursStart}</Text>
                    </View>
                  </View>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeLabel}>To</Text>
                    <View style={styles.timeInput}>
                      <Ionicons name="time" size={18} color={TEXT.tertiary} />
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
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.tertiary,
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
    borderTopColor: GLASS.light.border,
    marginTop: 8,
    paddingTop: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContent: {
    marginLeft: 0,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.primary,
  },
  sublabel: {
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginTop: 2,
  },
  subRow: {
    marginLeft: 52,
    marginTop: 8,
  },
  subLabel: {
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BACKGROUND.primary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  chipActive: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  chipText: {
    fontSize: 14,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
  },
  chipTextActive: {
    color: "#fff",
    fontFamily: "CareJournalUIMedium",
  },
  timeRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    marginLeft: 52,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginBottom: 6,
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.primary,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  timeValue: {
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: TEXT.primary,
  },
  saveButton: {
    backgroundColor: COLORS.terracotta,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
  },
});

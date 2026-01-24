import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";

interface Appointment {
  _id: string;
  title: string;
  type: "pediatrician" | "checkup" | "vaccine" | "wellness" | "custom";
  date: string;
  time: string;
  location?: string;
  isCompleted?: boolean;
}

interface Medication {
  _id: string;
  name: string;
  type: "prescription" | "otc" | "supplement";
  dosage?: string;
  frequency?: string;
  isActive?: boolean;
}

interface CalendarViewProps {
  activities?: {
    id: string;
    type: "feed" | "diaper" | "sleep" | "mood";
    timestamp: number;
    title: string;
  }[];
  appointments?: Appointment[];
  medications?: Medication[];
  onDateSelect?: (date: Date) => void;
  onActivityPress?: (activityId: string) => void;
  onAppointmentPress?: (appointmentId: string) => void;
  onAddAppointment?: () => void;
  onAddMedication?: () => void;
}

export function CalendarView({
  activities = [],
  appointments = [],
  medications = [],
  onDateSelect,
  onActivityPress,
  onAppointmentPress,
  onAddAppointment,
  onAddMedication,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  const getActivitiesForDate = (date: Date) => {
    const dateStart = date.setHours(0, 0, 0, 0);
    const dateEnd = date.setHours(23, 59, 59, 999);

    return activities.filter(
      (activity) =>
        activity.timestamp >= dateStart && activity.timestamp <= dateEnd
    );
  };

  const hasActivity = (date: Date) => {
    return getActivitiesForDate(date).length > 0;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getMedicationsForDate = () => {
    return medications.filter((med) => med.isActive);
  };

  const hasAppointment = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedActivities = selectedDate
    ? getActivitiesForDate(selectedDate)
    : [];

  const activityColors: Record<string, string> = {
    feed: "#f97316",
    diaper: "#3b82f6",
    sleep: "#8b5cf6",
    mood: "#ec4899",
  };

  const appointmentColors: Record<string, string> = {
    pediatrician: "#ef4444",
    checkup: "#3b82f6",
    vaccine: "#22c55e",
    wellness: "#8b5cf6",
    custom: "#64748b",
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "pediatrician":
        return "medical";
      case "checkup":
        return "checkmark-circle";
      case "vaccine":
        return "shield";
      case "wellness":
        return "heart";
      default:
        return "calendar";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth("prev")}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth("next")}>
            <Ionicons name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {daysInMonth.map((date, index) => {
            const isToday = date
              ? date.toDateString() === new Date().toDateString()
              : false;
            const isSelected = date
              ? selectedDate?.toDateString() === date.toDateString()
              : false;
            const hasAct = date ? hasActivity(date) : false;
            const hasApt = date ? hasAppointment(date) : false;
            const dateAppointments = date ? getAppointmentsForDate(date) : [];

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !date && styles.emptyDayCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedDayCell,
                ]}
                onPress={() => {
                  if (date) {
                    setSelectedDate(date);
                    onDateSelect?.(date);
                  }
                }}
                disabled={!date}
              >
                {date && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    {isSelected && dateAppointments.length > 0 && (
                      <View style={styles.appointmentBadge}>
                        <Text style={styles.appointmentBadgeText}>
                          {dateAppointments.length}
                        </Text>
                      </View>
                    )}
                    {!isSelected && hasAct && (
                      <View style={styles.activityDot} />
                    )}
                    {!isSelected && hasApt && !hasAct && (
                      <View
                        style={[
                          styles.appointmentDot,
                          { backgroundColor: "#6366f1" },
                        ]}
                      />
                    )}
                    {isSelected && <View style={styles.selectedDot} />}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickActionButton} onPress={onAddAppointment}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.quickActionText}>Appointment</Text>
        </Pressable>
        <Pressable
          style={[styles.quickActionButton, styles.medicationButton]}
          onPress={onAddMedication}
        >
          <Ionicons name="medical" size={20} color="#fff" />
          <Text style={styles.quickActionText}>Medication</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.activitiesSection}>
        <Text style={styles.activitiesTitle}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : "Select a date"}
        </Text>

        {selectedDate && (
          <View style={styles.appointmentsSection}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            {getAppointmentsForDate(selectedDate).length > 0 ? (
              getAppointmentsForDate(selectedDate).map((apt) => (
                <TouchableOpacity
                  key={apt._id}
                  style={styles.appointmentItem}
                  onPress={() => onAppointmentPress?.(apt._id)}
                >
                  <View
                    style={[
                      styles.appointmentIcon,
                      { backgroundColor: `${appointmentColors[apt.type]}20` },
                    ]}
                  >
                    <Ionicons
                      name={getAppointmentIcon(apt.type) as any}
                      size={20}
                      color={appointmentColors[apt.type]}
                    />
                  </View>
                  <View style={styles.appointmentContent}>
                    <Text style={styles.appointmentTitle}>{apt.title}</Text>
                    <Text style={styles.appointmentTime}>
                      {apt.time} {apt.location ? `• ${apt.location}` : ""}
                    </Text>
                  </View>
                  {apt.isCompleted && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#22c55e"
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noItemsText}>No appointments</Text>
            )}
          </View>
        )}

        {selectedDate && (
          <View style={styles.medicationsSection}>
            <Text style={styles.sectionTitle}>Active Medications</Text>
            {getMedicationsForDate().length > 0 ? (
              getMedicationsForDate().map((med) => (
                <View key={med._id} style={styles.medicationItem}>
                  <View
                    style={[
                      styles.medicationIcon,
                      { backgroundColor: "#22c55e20" },
                    ]}
                  >
                    <Ionicons name="medical" size={20} color="#22c55e" />
                  </View>
                  <View style={styles.medicationContent}>
                    <Text style={styles.medicationTitle}>{med.name}</Text>
                    <Text style={styles.medicationDetails}>
                      {med.dosage} {med.frequency ? `• ${med.frequency}` : ""}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No active medications</Text>
            )}
          </View>
        )}

        {selectedActivities.length > 0 && (
          <View style={styles.activitiesListSection}>
            <Text style={styles.sectionTitle}>Activities</Text>
            {selectedActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                onPress={() => onActivityPress?.(activity.id)}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: `${activityColors[activity.type]}20` },
                  ]}
                >
                  <Ionicons
                    name={
                      activity.type === "feed"
                        ? "restaurant"
                        : activity.type === "diaper"
                          ? "water"
                          : activity.type === "sleep"
                            ? "moon"
                            : "heart"
                    }
                    size={20}
                    color={activityColors[activity.type]}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedDate &&
          getAppointmentsForDate(selectedDate).length === 0 &&
          getMedicationsForDate().length === 0 &&
          selectedActivities.length === 0 && (
            <View style={styles.emptyActivities}>
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyActivitiesText}>
                No items on this day
              </Text>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  calendarSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  emptyDayCell: {},
  todayCell: {
    backgroundColor: "#ede9fe",
    borderRadius: 8,
  },
  selectedDayCell: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  selectedDayText: {
    color: "#ffffff",
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6366f1",
    marginTop: 2,
  },
  appointmentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    marginTop: 2,
  },
  appointmentBadge: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    position: "absolute",
    top: 4,
    right: 4,
  },
  appointmentBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#6366f1",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  medicationButton: {
    backgroundColor: "#22c55e",
  },
  quickActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  activitiesSection: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  appointmentsSection: {
    marginBottom: 16,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  appointmentTime: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  medicationsSection: {
    marginBottom: 16,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicationContent: {
    flex: 1,
  },
  medicationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  medicationDetails: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  activitiesListSection: {
    marginBottom: 16,
  },
  noItemsText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  activityTime: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  emptyActivities: {
    alignItems: "center",
    padding: 32,
  },
  emptyActivitiesText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 12,
  },
});

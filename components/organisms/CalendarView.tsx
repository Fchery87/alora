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
import { toLocalISODateString } from "@/lib/dates";
import { COLORS } from "@/lib/theme";

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
    const dateStr = toLocalISODateString(date);
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
    feed: COLORS.terracotta,
    diaper: COLORS.sage,
    sleep: COLORS.moss,
    mood: COLORS.clay,
  };

  const appointmentColors: Record<string, string> = {
    pediatrician: COLORS.clay,
    checkup: COLORS.sage,
    vaccine: COLORS.gold,
    wellness: COLORS.terracotta,
    custom: COLORS.stone,
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
                          styles.appointmentDotActive,
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
                    style={[styles.medicationIcon, styles.medicationIconBg]}
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
    backgroundColor: "transparent",
  },
  calendarSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 8,
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.warmDark,
    fontFamily: "CrimsonProMedium",
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.stone,
    fontFamily: "DMSans",
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
    borderRadius: 10,
  },
  emptyDayCell: {},
  todayCell: {
    backgroundColor: "rgba(139, 154, 125, 0.15)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  selectedDayCell: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 10,
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.warmDark,
    fontFamily: "DMSans",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  activityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
    marginTop: 3,
  },
  appointmentDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
  },
  appointmentDotActive: {
    backgroundColor: COLORS.terracotta,
  },
  selectedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ffffff",
    marginTop: 3,
  },
  appointmentBadge: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    alignItems: "center",
  },
  appointmentBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "DMSans",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  medicationButton: {
    backgroundColor: COLORS.sage,
    shadowColor: COLORS.sage,
  },
  quickActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans",
  },
  activitiesSection: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  activitiesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.warmDark,
    marginBottom: 16,
    fontFamily: "CrimsonProMedium",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.stone,
    marginBottom: 12,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "DMSans",
  },
  appointmentsSection: {
    marginBottom: 16,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
  },
  appointmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.warmDark,
    fontFamily: "DMSans",
  },
  appointmentTime: {
    fontSize: 13,
    color: COLORS.stone,
    marginTop: 3,
    fontFamily: "DMSans",
  },
  medicationsSection: {
    marginBottom: 16,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139, 154, 125, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(139, 154, 125, 0.2)",
  },
  medicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicationIconBg: {
    backgroundColor: "rgba(139, 154, 125, 0.2)",
  },
  medicationContent: {
    flex: 1,
  },
  medicationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.warmDark,
    fontFamily: "DMSans",
  },
  medicationDetails: {
    fontSize: 13,
    color: COLORS.stone,
    marginTop: 3,
    fontFamily: "DMSans",
  },
  activitiesListSection: {
    marginBottom: 16,
  },
  noItemsText: {
    fontSize: 14,
    color: COLORS.stone,
    fontStyle: "italic",
    paddingVertical: 8,
    fontFamily: "DMSans",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(201, 162, 39, 0.15)",
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.warmDark,
    fontFamily: "DMSans",
  },
  activityTime: {
    fontSize: 13,
    color: COLORS.stone,
    marginTop: 3,
    fontFamily: "DMSans",
  },
  emptyActivities: {
    alignItems: "center",
    padding: 32,
  },
  emptyActivitiesText: {
    fontSize: 15,
    color: COLORS.stone,
    marginTop: 12,
    fontFamily: "DMSans",
  },
});

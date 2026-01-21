import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";

interface CalendarViewProps {
  activities?: Array<{
    id: string;
    type: "feed" | "diaper" | "sleep" | "mood";
    timestamp: number;
    title: string;
  }>;
  onDateSelect?: (date: Date) => void;
  onActivityPress?: (activityId: string) => void;
}

export function CalendarView({
  activities = [],
  onDateSelect,
  onActivityPress,
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
                    {hasAct && !isSelected && (
                      <View style={styles.activityDot} />
                    )}
                    {isSelected && <View style={styles.selectedDot} />}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
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

        {selectedActivities.length > 0 ? (
          selectedActivities.map((activity) => (
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
          ))
        ) : selectedDate ? (
          <View style={styles.emptyActivities}>
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyActivitiesText}>
              No activities on this day
            </Text>
          </View>
        ) : null}
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
    marginBottom: 16,
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
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    marginTop: 2,
  },
  activitiesSection: {
    flex: 1,
    padding: 16,
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
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

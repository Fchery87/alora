import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationReminder } from "@/lib/notifications";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT } from "@/lib/theme";

interface NotificationReminderItemProps {
  reminder: NotificationReminder;
  onToggle: (id: string) => void;
  onEdit: (reminder: NotificationReminder) => void;
  onDelete: (id: string) => void;
}

export function NotificationReminderItem({
  reminder,
  onToggle,
  onEdit,
  onDelete,
}: NotificationReminderItemProps) {
  const getIcon = () => {
    switch (reminder.type) {
      case "feeding":
        return "restaurant-outline";
      case "sleep":
        return "moon-outline";
      case "diaper":
        return "water-outline";
      default:
        return "notifications-outline";
    }
  };

  const getIntervalText = () => {
    if (reminder.intervalMinutes) {
      if (reminder.intervalMinutes < 60)
        return `Every ${reminder.intervalMinutes} min`;
      const hours = Math.floor(reminder.intervalMinutes / 60);
      return `Every ${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (reminder.specificTime) {
      const [hours, minutes] = reminder.specificTime.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return "Not scheduled";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getIcon() as keyof typeof Ionicons.glyphMap}
            size={20}
            color={COLORS.terracotta}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{reminder.title}</Text>
          {reminder.message && (
            <Text style={styles.message}>{reminder.message}</Text>
          )}
          <Text style={styles.schedule}>{getIntervalText()}</Text>
        </View>
        <Switch
          value={reminder.isEnabled}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: BACKGROUND.tertiary, true: COLORS.sage }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(reminder)}
        >
          <Ionicons name="create-outline" size={16} color="#6b7280" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(reminder.id)}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={[styles.actionText, styles.deleteActionText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BACKGROUND.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: "CareJournalUISemiBold",
    color: THEME_TEXT.primary,
  },
  message: {
    fontSize: 13,
    color: THEME_TEXT.secondary,
    fontFamily: "CareJournalUI",
    marginTop: 2,
  },
  schedule: {
    fontSize: 12,
    color: THEME_TEXT.tertiary,
    fontFamily: "CareJournalUI",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BACKGROUND.tertiary,
    marginTop: 12,
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: THEME_TEXT.secondary,
    fontFamily: "CareJournalUIMedium",
  },
  deleteActionText: {
    color: COLORS.danger,
  },
});

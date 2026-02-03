import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface TrackerEntry {
  id: string;
  type: string;
  timestamp: number;
  summary: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface TrackerCardProps {
  entry: TrackerEntry;
  onPress?: () => void;
  onDelete?: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  feed: "#D4A574", // terracotta
  diaper: "#8B9A7D", // sage
  sleep: "#6B7A6B", // moss
  health: "#C17A5C", // clay
};

export function TrackerCard({ entry, onPress, onDelete }: TrackerCardProps) {
  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (entry.type) {
      case "feed":
        return "restaurant-outline";
      case "diaper":
        return "water-outline";
      case "sleep":
        return "moon-outline";
      case "health":
        return "medkit-outline";
      default:
        return "ellipse-outline";
    }
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const iconColor = TYPE_COLORS[entry.type] || "#C17A5C"; // clay as default
  const iconBgColor = `${iconColor}20`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={`tracker-card-${entry.id}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons
          name={entry.icon || getIconName()}
          size={24}
          color={iconColor}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.type, { color: iconColor }]}>{entry.type}</Text>
        <Text style={styles.summary}>{entry.summary}</Text>
        <Text style={styles.timestamp}>{formatTime(entry.timestamp)}</Text>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#C17A5C" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFBF7", // warm cream tint
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  summary: {
    fontSize: 16,
    color: "#2D2A26", // warm-dark
    marginBottom: 4,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#6B6560", // warm-gray
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

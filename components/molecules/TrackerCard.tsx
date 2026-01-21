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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={`tracker-card-${entry.id}`}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={entry.icon || getIconName()}
          size={24}
          color="#6366f1"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.type}>{entry.type}</Text>
        <Text style={styles.summary}>{entry.summary}</Text>
        <Text style={styles.timestamp}>{formatTime(entry.timestamp)}</Text>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
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
    color: "#6366f1",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  summary: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

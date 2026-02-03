import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FeedCardProps {
  feed: {
    id: string;
    type: string;
    side?: string;
    amount?: string;
    duration?: number;
    notes?: string;
    timestamp?: string | number;
  };
  onPress?: () => void;
  onDelete?: () => void;
}

const FEED_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  breast: "heart-outline",
  bottle: "beaker-outline",
  solid: "restaurant-outline",
  snack: "cafe-outline",
};

export function FeedCard({ feed, onPress, onDelete }: FeedCardProps) {
  const testId = feed.id ? feed.id.replace(/^feed-/, "") : "unknown";
  const icon = FEED_ICONS[feed.type] || "restaurant-outline";
  const terracotta = "#D4A574";

  const formatTime = (timestamp: string | number | undefined) => {
    if (!timestamp) return "";

    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <TouchableOpacity
      testID={`feed-card-${testId}`}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${terracotta}20` },
            ]}
          >
            <Ionicons name={icon} size={18} color={terracotta} />
          </View>
          <Text style={styles.title}>{feed.type}</Text>
        </View>
        {onDelete ? (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#C17A5C" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.details}>
        {feed.side ? (
          <View style={styles.detailBadge}>
            <Text style={styles.detailText}>{feed.side}</Text>
          </View>
        ) : null}
        {feed.amount ? (
          <View style={styles.detailBadge}>
            <Text style={styles.detailText}>{feed.amount}</Text>
          </View>
        ) : null}
        {typeof feed.duration === "number" ? (
          <View style={styles.detailBadge}>
            <Text style={styles.detailText}>{feed.duration} min</Text>
          </View>
        ) : null}
        {feed.timestamp ? (
          <Text style={styles.time}>{formatTime(feed.timestamp)}</Text>
        ) : null}
      </View>

      {feed.notes ? <Text style={styles.notes}>{feed.notes}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFBF7", // warm cream
    padding: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2A26", // warm-dark
    textTransform: "capitalize",
  },
  details: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailBadge: {
    backgroundColor: "rgba(212, 165, 116, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8B6B4A",
    textTransform: "capitalize",
  },
  time: {
    fontSize: 13,
    color: "#6B6560",
    marginLeft: "auto",
  },
  notes: {
    color: "#6B6560",
    fontSize: 13,
    lineHeight: 18,
  },
});

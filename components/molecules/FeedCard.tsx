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
  };
  onPress?: () => void;
  onDelete?: () => void;
}

export function FeedCard({ feed, onPress, onDelete }: FeedCardProps) {
  const testId = feed.id ? feed.id.replace(/^feed-/, "") : "unknown";
  return (
    <TouchableOpacity
      testID={`feed-card-${testId}`}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{feed.type}</Text>
        {onDelete ? (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.details}>
        {feed.side ? <Text>{feed.side}</Text> : null}
        {feed.amount ? <Text>{feed.amount}</Text> : null}
        {typeof feed.duration === "number" ? (
          <Text>{feed.duration} min</Text>
        ) : null}
      </View>
      {feed.notes ? <Text style={styles.notes}>{feed.notes}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  details: {
    flexDirection: "row",
    gap: 8,
  },
  notes: {
    color: "#475569",
    fontSize: 12,
  },
});

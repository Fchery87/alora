import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Entry {
  id: string;
  title: string;
  subtitle?: string;
  details?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  timestamp?: string | number;
  onPress?: () => void;
  onDelete?: () => void;
}

interface EntryListProps {
  entries: Entry[];
  title: string;
  emptyMessage?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function EntryList({
  entries,
  title,
  emptyMessage = "No entries yet",
  icon = "list-outline",
  onRefresh,
  refreshing,
}: EntryListProps) {
  const formatTime = (timestamp: string | number | undefined) => {
    if (!timestamp) return "";

    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={icon} size={24} color="#6366f1" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={onRefresh ? (
          <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} tintColor="#6366f1" />
        ) : undefined}
      >
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={entry.onPress}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryIcon}>
                  {entry.icon ? (
                    <Ionicons name={entry.icon} size={20} color={entry.iconColor || "#6366f1"} />
                  ) : null}
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                </View>
                <View style={styles.entryMeta}>
                  {entry.timestamp && (
                    <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                  )}
                  {entry.onDelete && (
                    <TouchableOpacity onPress={entry.onDelete} style={{ padding: 4 }}>
                      <Ionicons name="trash-outline" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {entry.subtitle && (
                <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>
              )}

              {entry.details && (
                <Text style={styles.entryDetails}>{entry.details}</Text>
              )}
            </TouchableOpacity>
          ))
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
  entryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  entryTime: {
    fontSize: 12,
    color: "#64748b",
  },
  entrySubtitle: {
    fontSize: 14,
    color: "#475569",
  },
  entryDetails: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});

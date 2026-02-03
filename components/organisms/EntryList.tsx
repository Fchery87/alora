import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Celestial Nurture Design System - Earth Tones
const COLORS = {
  cream: "#FAF7F2",
  terracotta: "#D4A574",
  sage: "#8B9A7D",
  moss: "#6B7A6B",
  gold: "#C9A227",
  clay: "#C17A5C",
  warmDark: "#2D2A26",
  warmGray: "#6B6560",
  stone: "#8B8680",
  sand: "#E8E0D5",
  warmLight: "#F5F0E8",
  white: "#FFFFFF",
};

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
        <Ionicons name={icon} size={24} color={COLORS.terracotta} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing ?? false}
              onRefresh={onRefresh}
              tintColor={COLORS.terracotta}
            />
          ) : undefined
        }
      >
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={COLORS.sand} />
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
                    <Ionicons
                      name={entry.icon}
                      size={20}
                      color={entry.iconColor || COLORS.terracotta}
                    />
                  ) : null}
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                </View>
                <View style={styles.entryMeta}>
                  {entry.timestamp && (
                    <Text style={styles.entryTime}>
                      {formatTime(entry.timestamp)}
                    </Text>
                  )}
                  {entry.onDelete && (
                    <TouchableOpacity
                      onPress={entry.onDelete}
                      style={styles.deleteButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={COLORS.stone}
                      />
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
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.warmLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.warmDark,
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
    color: COLORS.stone,
    textAlign: "center",
  },
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.warmDark,
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  entryTime: {
    fontSize: 12,
    color: COLORS.stone,
  },
  entrySubtitle: {
    fontSize: 14,
    color: COLORS.warmGray,
  },
  entryDetails: {
    fontSize: 13,
    color: COLORS.stone,
    lineHeight: 18,
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { JournalCard } from "@/components/molecules/JournalCard";
import { GradientButton } from "@/components/atoms/GradientButton";
import { TEXT, COLORS } from "@/lib/theme";

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string | number;
}

interface JournalListProps {
  entries: JournalEntry[];
  onEntryPress?: (entry: JournalEntry) => void;
  onEntryDelete?: (entry: JournalEntry) => void;
  onNewEntry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

export function JournalList({
  entries,
  onEntryPress,
  onEntryDelete,
  onNewEntry,
  onRefresh,
  refreshing = false,
  emptyMessage = "No journal entries yet. Start writing your thoughts!",
}: JournalListProps) {
  if (entries.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ dampingRatio: 0.8, stiffness: 150 }}
          style={styles.emptyContent}
        >
          <View style={styles.emptyIcon}>
            <Ionicons name="book-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Journal is Empty</Text>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
          {onNewEntry && (
            <GradientButton onPress={onNewEntry} variant="primary">
              Write First Entry
            </GradientButton>
          )}
        </MotiView>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {onNewEntry && (
        <View style={styles.header}>
          <Text style={styles.title}>Journal Entries</Text>
          <TouchableOpacity onPress={onNewEntry} style={styles.newButton}>
            <Ionicons name="add-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {entries.map((entry, index) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          onPress={() => onEntryPress?.(entry)}
          onDelete={() => onEntryDelete?.(entry)}
          delay={index * 50}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "CrimsonProBold",
    fontSize: 24,
    color: TEXT.primary,
  },
  newButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyContent: {
    alignItems: "center",
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(212, 165, 116, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "CrimsonProBold",
    fontSize: 22,
    color: TEXT.primary,
  },
  emptyMessage: {
    fontFamily: "DMSans",
    fontSize: 14,
    color: TEXT.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
});

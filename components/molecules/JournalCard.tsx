import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { RADIUS, SHADOWS, TEXT, COLORS } from "@/lib/theme";
import { Tag } from "@/components/atoms/Tag";

interface JournalCardProps {
  entry: {
    id: string;
    title?: string;
    content: string;
    tags: string[];
    isPrivate: boolean;
    createdAt: string | number;
  };
  onPress?: () => void;
  onDelete?: () => void;
  delay?: number;
}

export function JournalCard({
  entry,
  onPress,
  onDelete,
  delay = 0,
}: JournalCardProps) {
  const formatDate = (timestamp: string | number) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPreview = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay,
        dampingRatio: 0.8,
        stiffness: 150,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              {entry.isPrivate && (
                <View style={styles.privacyBadge}>
                  <Ionicons
                    name="lock-closed"
                    size={12}
                    color={COLORS.primary}
                  />
                </View>
              )}
              <Text style={styles.title} numberOfLines={1}>
                {entry.title || "Untitled Entry"}
              </Text>
            </View>

            <View style={styles.actions}>
              <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
              {onDelete && (
                <TouchableOpacity
                  onPress={onDelete}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={COLORS.danger}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={styles.preview}>{getPreview(entry.content)}</Text>

          {entry.tags.length > 0 && (
            <View style={styles.tags}>
              {entry.tags.slice(0, 3).map((tag, index) => (
                <Tag key={index} size="sm" variant="secondary">
                  {tag}
                </Tag>
              ))}
              {entry.tags.length > 3 && (
                <Tag size="sm" variant="default">
                  +{entry.tags.length - 3}
                </Tag>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  privacyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(212, 165, 116, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "OutfitSemiBold",
    fontSize: 16,
    color: TEXT.primary,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  date: {
    fontFamily: "DMSans",
    fontSize: 12,
    color: TEXT.tertiary,
  },
  deleteButton: {
    padding: 4,
  },
  preview: {
    fontFamily: "DMSans",
    fontSize: 14,
    color: TEXT.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
});

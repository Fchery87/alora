import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { RADIUS, TEXT, COLORS } from "@/lib/theme";

export type ActivityType =
  | "feed"
  | "diaper"
  | "sleep"
  | "growth"
  | "milestone"
  | "mood"
  | "journal";

interface ActivityFeedItemProps {
  type: ActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
  userName: string;
  userAvatar?: string;
  onPress?: () => void;
  delay?: number;
}

const activityConfig: Record<
  ActivityType,
  {
    icon: string;
    variant: "primary" | "secondary" | "accent" | "calm";
    label: string;
  }
> = {
  feed: { icon: "nutrition", variant: "primary", label: "Feed" },
  diaper: { icon: "water", variant: "secondary", label: "Diaper" },
  sleep: { icon: "moon", variant: "calm", label: "Sleep" },
  growth: { icon: "trending-up", variant: "accent", label: "Growth" },
  milestone: { icon: "trophy", variant: "accent", label: "Milestone" },
  mood: { icon: "heart", variant: "primary", label: "Mood" },
  journal: { icon: "book", variant: "secondary", label: "Journal" },
};

export function ActivityFeedItem({
  type,
  title,
  subtitle,
  timestamp,
  userName,
  onPress,
  delay = 0,
}: ActivityFeedItemProps) {
  const config = activityConfig[type];

  const content = (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        delay,
        dampingRatio: 0.8,
        stiffness: 150,
      }}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <GradientIcon name={config.icon} variant={config.variant} size={20} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.typeLabel}>{config.label}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <Text style={styles.userName}>by {userName}</Text>
        </View>
      </View>
    </MotiView>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.15)",
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  typeLabel: {
    fontFamily: "OutfitMedium",
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timestamp: {
    fontFamily: "DMSans",
    fontSize: 11,
    color: TEXT.tertiary,
  },
  title: {
    fontFamily: "OutfitSemiBold",
    fontSize: 15,
    color: TEXT.primary,
  },
  subtitle: {
    fontFamily: "DMSans",
    fontSize: 13,
    color: TEXT.secondary,
  },
  userName: {
    fontFamily: "DMSans",
    fontSize: 11,
    color: TEXT.tertiary,
    marginTop: 4,
  },
});

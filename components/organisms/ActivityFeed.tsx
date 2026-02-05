import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivityFeed, type ActivityItem } from "@/hooks/useActivityFeed";
import { color, font, radius, space, typeScale } from "@/lib/design/careJournal/tokens";

interface ActivityFeedProps {
  babyId?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  limit?: number;
}

export function ActivityFeed({
  babyId,
  onRefresh,
  refreshing = false,
  limit = 20,
}: ActivityFeedProps) {
  const { groupedActivities, isLoading } = useActivityFeed(
    babyId as any,
    limit
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const liveIndicatorAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!isLoading) {
      Animated.sequence([
        Animated.timing(liveIndicatorAnim, {
          toValue: 1.12,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(liveIndicatorAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [groupedActivities, isLoading, liveIndicatorAnim]);

  const renderAvatar = (userName?: string, avatarUrl?: string) => {
    const initials = userName
      ? userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

    if (avatarUrl) {
      return <Image source={{ uri: avatarUrl }} style={styles.avatar} />;
    }

    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
    );
  };

  const renderActivity = (activity: ActivityItem, withRule: boolean) => {
    return (
      <View key={activity.id} style={[styles.activityRow, withRule && styles.activityRule]}>
        {renderAvatar(activity.userName, activity.userAvatarUrl)}
        <View style={styles.activityText}>
          <Text style={styles.activityMessage}>{activity.message}</Text>
          <Text style={styles.timestamp}>{getRelativeTime(activity.timestamp)}</Text>
        </View>
        <View style={styles.activityIcon}>
          <Ionicons name={activity.icon as any} size={16} color={color.ink.faint} />
        </View>
      </View>
    );
  };

  const renderGroup = (title: string, activities: ActivityItem[]) => {
    if (activities.length === 0) return null;

    return (
      <View key={title} style={styles.groupContainer}>
        <Text style={styles.groupHeader}>{title}</Text>
        <View style={styles.groupCard}>
          {activities.map((a, idx) => renderActivity(a, idx !== activities.length - 1))}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="time-outline" size={34} color={color.ink.faint} />
      </View>
      <Text style={styles.emptyTitle}>No activity yet</Text>
      <Text style={styles.emptySubtitle}>
        Start logging feeds, diapers, sleep, and more to see activity here
      </Text>
      <TouchableOpacity style={styles.emptyButton} activeOpacity={0.85}>
        <Ionicons name="add-circle-outline" size={18} color={color.pigment.clay} />
        <Text style={styles.emptyButtonText}>Log first activity</Text>
      </TouchableOpacity>
    </View>
  );

  const hasActivity =
    groupedActivities.today.length > 0 ||
    groupedActivities.yesterday.length > 0 ||
    groupedActivities.earlier.length > 0;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.skeletonRow}>
            <View style={styles.skeletonCircle} />
            <View style={styles.skeletonTextWrapper}>
              <View style={styles.skeletonLine1} />
              <View style={styles.skeletonLine2} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <Animated.View testID="activity-feed" style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="pulse-outline" size={18} color={color.pigment.clay} />
          <Text style={styles.headerTitle}>Activity</Text>
        </View>
        {!refreshing && hasActivity && (
          <Animated.View style={{ transform: [{ scale: liveIndicatorAnim }] }}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={color.pigment.clay}
            />
          ) : undefined
        }
      >
        {!hasActivity ? (
          renderEmptyState()
        ) : (
          <>
            {renderGroup("Today", groupedActivities.today)}
            {renderGroup("Yesterday", groupedActivities.yesterday)}
            {renderGroup("Earlier", groupedActivities.earlier)}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.paper.wash,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: color.paper.edge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: color.paper.edge,
    backgroundColor: color.paper.base,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  headerTitle: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(47, 107, 91, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(47, 107, 91, 0.18)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.pigment.sage,
  },
  liveText: {
    fontFamily: font.ui.medium,
    fontSize: 10,
    color: color.pigment.sage,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  scrollView: {
    maxHeight: 420,
  },
  scrollContent: {
    paddingVertical: space[2],
  },
  groupContainer: {
    paddingBottom: space[2],
  },
  groupHeader: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
  groupCard: {
    marginHorizontal: space[4],
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.md,
    backgroundColor: color.paper.base,
    paddingHorizontal: space[3],
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space[2],
    paddingVertical: space[3],
  },
  activityRule: {
    borderBottomWidth: 1,
    borderBottomColor: color.paper.edge,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.paper.wash,
    borderWidth: 1,
    borderColor: color.paper.edge,
  },
  avatarInitials: {
    fontFamily: font.ui.semibold,
    fontSize: 11,
    letterSpacing: 0.4,
    color: color.ink.muted,
  },
  activityText: {
    flex: 1,
  },
  activityMessage: {
    fontFamily: font.ui.medium,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.strong,
  },
  timestamp: {
    marginTop: 4,
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: typeScale.caption.letterSpacing,
    color: color.ink.faint,
  },
  activityIcon: {
    paddingTop: 2,
  },
  emptyContainer: {
    paddingVertical: space[8],
    paddingHorizontal: space[6],
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: color.paper.base,
    borderWidth: 1,
    borderColor: color.paper.edge,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space[3],
  },
  emptyTitle: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    color: color.ink.strong,
  },
  emptySubtitle: {
    marginTop: space[2],
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    color: color.ink.muted,
    textAlign: "center",
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
    backgroundColor: "rgba(196, 106, 74, 0.12)",
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: radius.md,
    marginTop: space[4],
    borderWidth: 1,
    borderColor: "rgba(196, 106, 74, 0.18)",
  },
  emptyButtonText: {
    fontFamily: font.ui.semibold,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    color: color.pigment.clay,
  },
  loadingContainer: {
    padding: space[4],
  },
  skeletonRow: {
    flexDirection: "row",
    marginBottom: space[3],
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.paper.wash,
    borderWidth: 1,
    borderColor: color.paper.edge,
    marginRight: space[3],
  },
  skeletonTextWrapper: {
    flex: 1,
    gap: space[2],
    paddingTop: 6,
  },
  skeletonLine1: {
    width: "70%",
    height: 12,
    backgroundColor: color.paper.wash,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: color.paper.edge,
  },
  skeletonLine2: {
    width: "40%",
    height: 12,
    backgroundColor: color.paper.wash,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: color.paper.edge,
  },
});

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} min ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  } else if (diff < 2 * day) {
    return "Yesterday";
  } else {
    const days = Math.floor(diff / day);
    return `${days} days ago`;
  }
}


import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivityFeed, ActivityItem } from "@/hooks/useActivityFeed";
import { Text } from "@/components/ui/Text";

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
};

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
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!isLoading) {
      Animated.sequence([
        Animated.timing(liveIndicatorAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(liveIndicatorAnim, {
          toValue: 1,
          duration: 150,
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

  const renderActivity = (activity: ActivityItem) => {
    return (
      <Animated.View
        key={activity.id}
        style={[styles.activityContainer, { opacity: fadeAnim }]}
      >
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${activity.iconColor}20` },
            ]}
          >
            <Ionicons
              name={activity.icon as any}
              size={18}
              color={activity.iconColor}
            />
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.activityRow}>
            {renderAvatar(activity.userName, activity.userAvatarUrl)}
            <View style={styles.textWrapper}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.timestamp}>
                {getRelativeTime(activity.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderGroup = (title: string, activities: ActivityItem[]) => {
    if (activities.length === 0) return null;

    return (
      <View key={title} style={styles.groupContainer}>
        <Text style={styles.groupHeader}>{title}</Text>
        {activities.map((activity) => renderActivity(activity))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="time-outline" size={40} color={COLORS.stone} />
      </View>
      <Text style={styles.emptyTitle}>No activity yet</Text>
      <Text style={styles.emptySubtitle}>
        Start logging feeds, diapers, sleep, and more to see activity here
      </Text>
      <TouchableOpacity style={styles.emptyButton}>
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={COLORS.terracotta}
        />
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="pulse-outline" size={20} color={COLORS.terracotta} />
          <Text style={styles.headerTitle}>Activity Feed</Text>
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
              tintColor={COLORS.terracotta}
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
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
    backgroundColor: COLORS.warmLight,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.warmDark,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139, 154, 125, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.sage,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.sage,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  groupContainer: {
    marginBottom: 8,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.warmGray,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(232, 224, 213, 0.5)",
  },
  activityContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  iconWrapper: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    flex: 1,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
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
    backgroundColor: COLORS.sand,
  },
  avatarInitials: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.warmGray,
  },
  textWrapper: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.warmDark,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.warmGray,
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.sand,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.warmDark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.warmGray,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(212, 165, 116, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.3)",
  },
  emptyButtonText: {
    color: COLORS.terracotta,
    fontWeight: "700",
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
  },
  skeletonRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.sand,
    marginRight: 12,
  },
  skeletonTextWrapper: {
    flex: 1,
    gap: 8,
  },
  skeletonLine1: {
    width: "70%",
    height: 12,
    backgroundColor: COLORS.sand,
    borderRadius: 6,
  },
  skeletonLine2: {
    width: "40%",
    height: 12,
    backgroundColor: COLORS.sand,
    borderRadius: 6,
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

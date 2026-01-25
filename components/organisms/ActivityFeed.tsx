import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivityFeed, ActivityItem } from "@/hooks/useActivityFeed";

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
      return <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />;
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
    );
  };

  const renderActivity = (activity: ActivityItem, index: number) => {
    return (
      <Animated.View
        key={activity.id}
        style={[styles.activityItem, { opacity: fadeAnim }]}
      >
        <View style={styles.activityLeft}>
          <View
            style={[
              styles.activityIcon,
              { backgroundColor: activity.iconBgColor },
            ]}
          >
            <Ionicons
              name={activity.icon as any}
              size={20}
              color={activity.iconColor}
            />
          </View>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            {renderAvatar(activity.userName, activity.userAvatarUrl)}
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>
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
      <View key={title} style={styles.activityGroup}>
        <Text style={styles.groupTitle}>{title}</Text>
        {activities.map((activity, index) => renderActivity(activity, index))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="time-outline" size={48} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No activity yet</Text>
      <Text style={styles.emptyMessage}>
        Start logging feeds, diapers, sleep, and more to see activity here
      </Text>
      <TouchableOpacity style={styles.emptyButton}>
        <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
        <Text style={styles.emptyButtonText}>Log your first activity</Text>
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
          <View key={i} style={styles.skeletonItem}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonContent}>
              <View style={[styles.skeletonLine, styles.skeletonLinePrimary]} />
              <View
                style={[styles.skeletonLine, styles.skeletonLineSecondary]}
              />
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
          <Ionicons name="pulse-outline" size={20} color="#6366f1" />
          <Text style={styles.headerTitle}>Activity Feed</Text>
        </View>
        {!refreshing && hasActivity && (
          <Animated.View style={{ transform: [{ scale: liveIndicatorAnim }] }}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  liveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  activityGroup: {
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
  },
  activityItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  activityLeft: {
    marginRight: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  activityTextContainer: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  loadingContainer: {
    padding: 20,
  },
  skeletonItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f3f4f6",
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  skeletonLinePrimary: {
    width: "70%",
    height: 14,
  },
  skeletonLineSecondary: {
    width: "40%",
    height: 12,
  },
});

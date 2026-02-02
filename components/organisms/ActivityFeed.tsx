import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivityFeed, ActivityItem } from "@/hooks/useActivityFeed";
import { useAuth } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";

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
      return (
        <Image source={{ uri: avatarUrl }} className="w-8 h-8 rounded-full" />
      );
    }

    return (
      <View className="w-8 h-8 rounded-full items-center justify-center bg-nano-800">
        <Text className="text-[10px] font-bold text-nano-400">{initials}</Text>
      </View>
    );
  };

  const renderActivity = (activity: ActivityItem, index: number) => {
    return (
      <Animated.View
        key={activity.id}
        className="flex-row px-5 py-3 items-start"
        style={{
          opacity: fadeAnim,
        }}
      >
        <View className="mr-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${activity.iconColor}20` }}
          >
            <Ionicons
              name={activity.icon as any}
              size={18}
              color={activity.iconColor}
            />
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start gap-3">
            {renderAvatar(activity.userName, activity.userAvatarUrl)}
            <View className="flex-1">
              <Text className="text-white text-sm font-medium leading-5">
                {activity.message}
              </Text>
              <Text className="text-nano-500 text-xs mt-1">
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
      <View key={title} className="mb-2">
        <Text className="text-[11px] font-bold text-nano-500 uppercase tracking-widest px-5 py-2 bg-nano-900/50">
          {title}
        </Text>
        {activities.map((activity, index) => renderActivity(activity, index))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="py-12 px-8 items-center">
      <View className="w-20 h-20 rounded-full bg-nano-900 items-center justify-center mb-4">
        <Ionicons name="time-outline" size={40} color="#333" />
      </View>
      <Text className="text-white text-lg font-bold">No activity yet</Text>
      <Text className="text-nano-500 text-sm text-center mt-2 leading-5">
        Start logging feeds, diapers, sleep, and more to see activity here
      </Text>
      <TouchableOpacity className="flex-row items-center gap-2 bg-banana-500/10 px-5 py-3 rounded-xl mt-6 border border-banana-500/20">
        <Ionicons name="add-circle-outline" size={20} color="#FFE135" />
        <Text className="text-banana-500 font-bold text-sm">
          Log first activity
        </Text>
      </TouchableOpacity>
    </View>
  );

  const hasActivity =
    groupedActivities.today.length > 0 ||
    groupedActivities.yesterday.length > 0 ||
    groupedActivities.earlier.length > 0;

  if (isLoading) {
    return (
      <View className="p-5">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row mb-4">
            <View className="w-10 h-10 rounded-full bg-nano-900 mr-3" />
            <View className="flex-1 gap-2">
              <View className="w-[70%] h-3 bg-nano-900 rounded" />
              <View className="w-[40%] h-3 bg-nano-900 rounded" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <Animated.View
      className="bg-nano-900 border border-nano-800 rounded-3xl overflow-hidden shadow-2xl"
      style={{ opacity: fadeAnim }}
    >
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-nano-800">
        <View className="flex-row items-center gap-2">
          <Ionicons name="pulse-outline" size={20} color="#FFE135" />
          <Text className="text-white text-lg font-bold">Activity Feed</Text>
        </View>
        {!refreshing && hasActivity && (
          <Animated.View style={{ transform: [{ scale: liveIndicatorAnim }] }}>
            <View className="flex-row items-center bg-green-500/10 px-2.5 py-1 rounded-full gap-1.5">
              <View className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-[10px] font-bold text-green-500 uppercase">
                Live
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      <ScrollView
        className="max-h-[400px]"
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFE135"
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

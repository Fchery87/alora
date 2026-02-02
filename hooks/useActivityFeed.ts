import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";

const feedsApi = (api as any).feeds as any;
const diapersApi = (api as any).diapers as any;
const sleepApi = (api as any).sleep as any;
const milestonesApi = (api as any).milestones as any;
const wellnessApi = (api as any).wellness as any;
const journalApi = (api as any).journal as any;
const usersApi = (api as any).users as any;

const EMPTY_ARRAY: any[] = [];

export type ActivityType =
  | "feed"
  | "diaper"
  | "sleep"
  | "milestone"
  | "mood"
  | "journal";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: Id<"users">;
  userName?: string;
  userAvatarUrl?: string;
  timestamp: number;
  message: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  babyId?: Id<"babies">;
  babyName?: string;
}

export function useActivityFeed(babyId?: Id<"babies">, limit: number = 20) {
  const { userId } = useAuth();

  // Fetch data from all sources using Convex's real-time queries
  const feeds =
    useQuery(feedsApi.listFeeds, {
      babyId: babyId as any,
      limit: 50,
    }) ?? EMPTY_ARRAY;

  const diapers =
    useQuery(diapersApi.listDiapers, {
      babyId: babyId as any,
      limit: 50,
    }) ?? EMPTY_ARRAY;

  const sleep =
    useQuery(sleepApi.listSleep, {
      babyId: babyId as any,
      limit: 50,
    }) ?? EMPTY_ARRAY;

  const milestones =
    useQuery(milestonesApi.list, {
      babyId: babyId as any,
    }) ?? EMPTY_ARRAY;

  const moodCheckIns =
    useQuery(wellnessApi.listMood, {
      babyId: babyId as any,
      limit: 20,
    }) ?? EMPTY_ARRAY;

  const journalEntries =
    useQuery(journalApi.list, {
      limit: 20,
    }) ?? EMPTY_ARRAY;

  // Fetch user data for each activity
  const userIds = useMemo(() => {
    const ids = new Set<string>();
    feeds.forEach((f: any) => ids.add(f.createdById));
    diapers.forEach((d: any) => ids.add(d.createdById));
    sleep.forEach((s: any) => ids.add(s.createdById));
    moodCheckIns.forEach((m: any) => ids.add(m.userId));
    journalEntries.forEach((j: any) => ids.add(j.userId));
    return Array.from(ids) as Id<"users">[];
  }, [feeds, diapers, sleep, moodCheckIns, journalEntries]);

  const users = useQuery(usersApi.getUsersByIds, { userIds }) ?? EMPTY_ARRAY;

  // Transform all data into a unified activity feed
  const activities = useMemo(() => {
    const allActivities: ActivityItem[] = [];

    type UserInfo = { name?: string; avatarUrl?: string };
    const userMap = new Map<string, UserInfo>(
      users.map((u: any) => [
        u._id,
        {
          name: u.name,
          avatarUrl: u.avatarUrl,
        } as UserInfo,
      ])
    );

    // Process feeds
    feeds.forEach((feed: any) => {
      const user = userMap.get(feed.createdById) as {
        name?: string;
        avatarUrl?: string;
      };
      const durationText = feed.duration ? ` (${feed.duration} min)` : "";
      const typeText = feed.type === "breast" ? "breast feeding" : feed.type;

      allActivities.push({
        id: `feed-${feed._id}`,
        type: "feed",
        userId: feed.createdById,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        timestamp: feed.startTime,
        message: `${user.name || "Someone"} logged a ${typeText}${durationText}`,
        icon: "restaurant",
        iconColor: "#ea580c",
        iconBgColor: "#ffedd5",
        babyId: feed.babyId,
      });
    });

    // Process diapers
    diapers.forEach((diaper: any) => {
      const user = userMap.get(diaper.createdById) as {
        name?: string;
        avatarUrl?: string;
      };

      allActivities.push({
        id: `diaper-${diaper._id}`,
        type: "diaper",
        userId: diaper.createdById,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        timestamp: diaper.startTime,
        message: `${user.name || "Someone"} logged a ${diaper.type} diaper`,
        icon: "water",
        iconColor: "#2563eb",
        iconBgColor: "#dbeafe",
        babyId: diaper.babyId,
      });
    });

    // Process sleep
    sleep.forEach((s: any) => {
      const user = userMap.get(s.createdById) as {
        name?: string;
        avatarUrl?: string;
      };
      const durationText = s.duration
        ? `${Math.round(s.duration / 60000)} min`
        : s.endTime
          ? `${Math.round((s.endTime - s.startTime) / 60000)} min`
          : "";

      allActivities.push({
        id: `sleep-${s._id}`,
        type: "sleep",
        userId: s.createdById,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        timestamp: s.startTime,
        message: `${user.name || "Someone"} logged ${durationText ? `a ${durationText} ` : ""}${s.type}`,
        icon: "moon",
        iconColor: "#7c3aed",
        iconBgColor: "#ede9fe",
        babyId: s.babyId,
      });
    });

    // Process milestones
    milestones.forEach((milestone: any) => {
      if (milestone.isCelebrated) {
        allActivities.push({
          id: `milestone-${milestone._id}`,
          type: "milestone",
          userId: milestone.createdById || (userId as any),
          userName: "Family",
          userAvatarUrl: undefined,
          timestamp: new Date(milestone.date || Date.now()).getTime(),
          message: `${milestone.title} celebrated! 🎉`,
          icon: "trophy",
          iconColor: "#dc2626",
          iconBgColor: "#fee2e2",
          babyId: milestone.babyId,
        });
      }
    });

    // Process mood check-ins
    moodCheckIns.forEach((mood: any) => {
      const user = userMap.get(mood.userId) as {
        name?: string;
        avatarUrl?: string;
      };
      const moodEmojis: Record<string, string> = {
        great: "😊",
        good: "🙂",
        okay: "😐",
        low: "😔",
        struggling: "😢",
      };

      allActivities.push({
        id: `mood-${mood._id}`,
        type: "mood",
        userId: mood.userId,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        timestamp: mood.createdAt,
        message: `${user.name || "You"} checked in: Feeling ${mood.mood} ${moodEmojis[mood.mood] || ""}`,
        icon: "heart",
        iconColor: "#ec4899",
        iconBgColor: "#fce7f3",
        babyId: mood.babyId,
      });
    });

    // Process journal entries
    journalEntries.forEach((entry: any) => {
      const user = userMap.get(entry.userId) as {
        name?: string;
        avatarUrl?: string;
      };

      allActivities.push({
        id: `journal-${entry._id}`,
        type: "journal",
        userId: entry.userId,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        timestamp: entry.createdAt,
        message: `${user.name || "You"} ${entry.isGratitude ? "wrote a gratitude journal entry" : entry.isWin ? "celebrated a win" : "wrote a journal entry"}`,
        icon: "book",
        iconColor: "#0891b2",
        iconBgColor: "#cffafe",
        babyId: entry.babyId,
      });
    });

    // Sort by timestamp (newest first) and limit
    return allActivities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [
    feeds,
    diapers,
    sleep,
    milestones,
    moodCheckIns,
    journalEntries,
    users,
    userId,
    limit,
  ]);

  // Group activities by time period
  const groupedActivities = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    const groups: Record<string, ActivityItem[]> = {
      today: [],
      yesterday: [],
      earlier: [],
    };

    activities.forEach((activity) => {
      if (activity.timestamp >= todayStart) {
        groups.today.push(activity);
      } else if (activity.timestamp >= yesterdayStart) {
        groups.yesterday.push(activity);
      } else {
        groups.earlier.push(activity);
      }
    });

    return groups;
  }, [activities]);

  return {
    activities,
    groupedActivities,
    isLoading:
      feeds === undefined ||
      diapers === undefined ||
      sleep === undefined ||
      milestones === undefined ||
      moodCheckIns === undefined ||
      journalEntries === undefined,
    error: null,
  };
}

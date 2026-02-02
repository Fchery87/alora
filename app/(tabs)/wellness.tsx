import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import type { MotiTransition } from "@/lib/moti-types";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getDailyAffirmation, getRandomSelfCareNudge } from "@/lib/self-care";
import { MoodTrendChart } from "@/components/organisms/MoodTrendChart";
import { useListMood } from "@/hooks/queries/useMoodCheckIns";
import { generateDailyInsight } from "@/lib/insights/rules";
import { useDailyInsight, useAiInsightSettings } from "@/hooks/useDailyInsight";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePushSync } from "@/hooks/usePushSync";
import { RESOURCES } from "@/lib/resources";
import { recommendResources } from "@/lib/smart-resources";

type DateRange = "7d" | "30d" | "90d" | "all";

export default function WellnessScreen() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [savedInsights, setSavedInsights] = useState<Set<string>>(new Set());
  const [savedAffirmations, setSavedAffirmations] = useState<Set<string>>(
    new Set()
  );

  const dailyAffirmation = getDailyAffirmation();
  const selfCareNudge = getRandomSelfCareNudge();
  const { data: moodData, isLoading } = useListMood();
  const rulesInsight = generateDailyInsight({
    moodEntries:
      moodData?.map((entry: any) => ({
        mood: entry.mood,
        createdAt: entry.createdAt ?? entry._creationTime,
      })) ?? [],
  });
  const { settings, setEnabled } = useAiInsightSettings();
  const aiEnabled = Boolean(settings?.aiInsightsEnabled);
  const { data: aiInsight, isLoading: isInsightLoading } =
    useDailyInsight(aiEnabled);
  const dailyInsight = aiInsight ?? rulesInsight;

  const pushSettings = useQuery(api.functions.push.index.getPushSettings);
  const setPushEnabled = useMutation(
    api.functions.push.index.setPushNotificationsEnabled
  );
  const sendTestPush = useAction(api.functions.push.index.sendTestPush);
  const pushEnabled = Boolean(pushSettings?.pushNotificationsEnabled);
  const { error: pushError, isRegistering } = usePushSync(pushEnabled);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const toggleSaveInsight = (id: string) => {
    const newSaved = new Set(savedInsights);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedInsights(newSaved);
  };

  const toggleSaveAffirmation = (id: string) => {
    const newSaved = new Set(savedAffirmations);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedAffirmations(newSaved);
  };

  const resetDailyCards = () => {
    setSavedInsights(new Set());
    setSavedAffirmations(new Set());
  };

  const moodChartData =
    moodData?.map((entry: any) => ({
      date: entry._creationTime,
      mood:
        entry.mood === "great"
          ? 5
          : entry.mood === "good"
            ? 4
            : entry.mood === "okay"
              ? 3
              : entry.mood === "low"
                ? 2
                : 1,
    })) || [];

  const smartResources = recommendResources({
    resources: RESOURCES,
    nowMs: Date.now(),
    moodEntries:
      moodData?.map((entry: any) => ({
        mood: entry.mood,
        createdAt: entry.createdAt ?? entry._creationTime,
      })) ?? [],
    limit: 2,
  });

  const quickActions = [
    {
      id: "check-in",
      title: "Check-In",
      icon: "heart" as const,
      color: "#f472b6",
      bgColor: "#fce7f3",
      route: "/(tabs)/trackers/mood" as any,
    },
    {
      id: "journal",
      title: "Journal",
      icon: "book" as const,
      color: "#a78bfa",
      bgColor: "#ede9fe",
      route: "/(tabs)/calendar",
    },
    {
      id: "breathe",
      title: "Breathe",
      icon: "moon" as const,
      color: "#67e8f9",
      bgColor: "#ecfeff",
      route: "/",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness</Text>
        <TouchableOpacity onPress={resetDailyCards}>
          <Ionicons name="refresh-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Daily Insight Card - Hero Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring" } as MotiTransition}
        style={styles.affirmationSection}
      >
        <LinearGradient
          colors={["#dbeafe", "#fce7f3", "#ede9fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.affirmationCard}
        >
          <View style={styles.affirmationHeader}>
            <View style={styles.affirmationBadge}>
              <Ionicons name="sparkles" size={16} color="#f59e0b" />
              <Text style={styles.affirmationBadgeText}>Today's Insight</Text>
            </View>
            <View style={styles.aiToggleRow}>
              <Text style={styles.aiToggleLabel}>AI</Text>
              <Switch
                value={aiEnabled}
                onValueChange={(v) => void setEnabled({ enabled: v })}
              />
            </View>
            <TouchableOpacity
              onPress={() => toggleSaveInsight(dailyInsight.id)}
              style={styles.saveButton}
            >
              <Ionicons
                name={
                  savedInsights.has(dailyInsight.id)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={22}
                color={
                  savedInsights.has(dailyInsight.id) ? "#ec4899" : "#9ca3af"
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.affirmationMessage}>
            {aiEnabled && isInsightLoading
              ? "Loading your insight…"
              : dailyInsight.message}
          </Text>

          <View style={styles.pushSection}>
            <View style={styles.pushRow}>
              <Text style={styles.pushLabel}>Push notifications</Text>
              <Switch
                value={pushEnabled}
                onValueChange={(v) => void setPushEnabled({ enabled: v })}
              />
            </View>
            {pushEnabled ? (
              <Pressable
                style={styles.testPushButton}
                onPress={() => void sendTestPush({})}
                disabled={isRegistering}
              >
                <Text style={styles.testPushButtonText}>
                  {isRegistering ? "Registering…" : "Send test push"}
                </Text>
              </Pressable>
            ) : null}
            {pushError ? (
              <Text style={styles.pushErrorText}>{pushError}</Text>
            ) : null}
          </View>

          <View style={styles.affirmationMeta}>
            <View style={styles.affirmationMetaItem}>
              <Ionicons name="heart-outline" size={14} color="#9ca3af" />
              <Text style={styles.affirmationMetaText}>
                {dailyInsight.title}
              </Text>
            </View>
            <Text style={styles.affirmationDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Daily Affirmation Card */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={
          { type: "spring", delay: 80, damping: 12 } as MotiTransition
        }
        style={styles.affirmationSection}
      >
        <LinearGradient
          colors={["#fef3c7", "#fce7f3", "#ede9fe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.affirmationCard}
        >
          <View style={styles.affirmationHeader}>
            <View style={styles.affirmationBadge}>
              <Ionicons name="sparkles" size={16} color="#f59e0b" />
              <Text style={styles.affirmationBadgeText}>
                Today's Affirmation
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleSaveAffirmation(dailyAffirmation.id)}
              style={styles.saveButton}
            >
              <Ionicons
                name={
                  savedAffirmations.has(dailyAffirmation.id)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={22}
                color={
                  savedAffirmations.has(dailyAffirmation.id)
                    ? "#ec4899"
                    : "#9ca3af"
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.affirmationMessage}>
            {dailyAffirmation.message}
          </Text>

          <View style={styles.affirmationMeta}>
            <View style={styles.affirmationMetaItem}>
              <Ionicons name="heart-outline" size={14} color="#9ca3af" />
              <Text style={styles.affirmationMetaText}>
                {dailyAffirmation.theme}
              </Text>
            </View>
            <Text style={styles.affirmationDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Quick Check-In Button */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          { type: "spring", delay: 100, damping: 10 } as MotiTransition
        }
      >
        <Pressable
          style={styles.checkInButton}
          onPress={() => router.push("/(tabs)/trackers/mood")}
        >
          <View style={styles.checkInButtonContent}>
            <View style={styles.checkInIcon}>
              <Ionicons name="heart" size={28} color="#ffffff" />
            </View>
            <View style={styles.checkInText}>
              <Text style={styles.checkInTitle}>How are you feeling?</Text>
              <Text style={styles.checkInSubtitle}>
                Take a moment to check in with yourself
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </View>
        </Pressable>
      </MotiView>

      {/* Mood Trends Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={
          { type: "spring", delay: 200, damping: 10 } as MotiTransition
        }
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mood Trends</Text>
          {!isLoading && moodChartData.length > 0 && (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/trackers/mood")}
            >
              <Text style={styles.sectionAction}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.loadingText}>Loading mood data...</Text>
          </View>
        ) : moodChartData.length > 0 ? (
          <MoodTrendChart
            data={moodChartData}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        ) : (
          <View style={styles.emptyChartState}>
            <Ionicons name="heart-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyChartTitle}>No mood data yet</Text>
            <Text style={styles.emptyChartSubtitle}>
              Start tracking to see your wellness patterns
            </Text>
            <TouchableOpacity
              style={styles.emptyChartButton}
              onPress={() => router.push("/(tabs)/trackers/mood")}
            >
              <Text style={styles.emptyChartButtonText}>Start Tracking</Text>
            </TouchableOpacity>
          </View>
        )}
      </MotiView>

      {/* Smart Resources */}
      {smartResources.length > 0 ? (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={
            { type: "spring", delay: 250, damping: 10 } as MotiTransition
          }
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Smart Resources</Text>
          </View>

          {smartResources.map((rec) => (
            <View key={rec.resource.id} style={styles.nudgeCard}>
              <View style={[styles.nudgeIcon, styles.resourceNudgeIcon]}>
                <Ionicons name="book" size={24} color="#6366f1" />
              </View>
              <View style={styles.nudgeContent}>
                <Text style={styles.nudgeCategory}>{rec.resource.title}</Text>
                <Text style={styles.nudgeMessage}>
                  {rec.reason ||
                    "Recommended for you based on recent check-ins."}
                </Text>
              </View>
            </View>
          ))}
        </MotiView>
      ) : null}

      {/* Self-Care Nudges Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={
          { type: "spring", delay: 300, damping: 10 } as MotiTransition
        }
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Gentle Reminders</Text>

        <TouchableOpacity style={styles.nudgeCard} activeOpacity={0.7}>
          <View style={[styles.nudgeIcon, styles.mindfulnessNudgeIcon]}>
            <Ionicons name="leaf" size={24} color="#0891b2" />
          </View>
          <View style={styles.nudgeContent}>
            <Text style={styles.nudgeCategory}>Mindfulness</Text>
            <Text style={styles.nudgeMessage}>{selfCareNudge.message}</Text>
          </View>
          <TouchableOpacity style={styles.nudgeAction}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#d1d5db"
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.nudgeStats}>
          <View style={styles.nudgeStat}>
            <Text style={styles.nudgeStatValue}>3</Text>
            <Text style={styles.nudgeStatLabel}>Today</Text>
          </View>
          <View style={styles.nudgeStatDivider} />
          <View style={styles.nudgeStat}>
            <Text style={styles.nudgeStatValue}>12</Text>
            <Text style={styles.nudgeStatLabel}>This Week</Text>
          </View>
          <View style={styles.nudgeStatDivider} />
          <View style={styles.nudgeStat}>
            <Text style={styles.nudgeStatValue}>🔥</Text>
            <Text style={styles.nudgeStatLabel}>5 Day Streak</Text>
          </View>
        </View>
      </MotiView>

      {/* Quick Actions Row */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={
          { type: "spring", delay: 400, damping: 10 } as MotiTransition
        }
        style={styles.quickActionsSection}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => router.push(action.route)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.bgColor },
                ]}
              >
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </MotiView>

      {/* Bottom Padding for Tab Bar */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  // Affirmation Section
  affirmationSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  affirmationCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  affirmationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  affirmationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  affirmationBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d97706",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  aiToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiToggleLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  pushSection: {
    marginTop: 14,
  },
  pushRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pushLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  testPushButton: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  testPushButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  pushErrorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#ef4444",
  },
  saveButton: {
    padding: 4,
  },
  affirmationMessage: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e293b",
    lineHeight: 32,
    marginBottom: 20,
    fontStyle: "italic",
  },
  affirmationMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  affirmationMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  affirmationMetaText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  affirmationDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  // Check-In Button
  checkInButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  checkInButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  checkInIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkInText: {
    flex: 1,
    marginLeft: 16,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  // Chart
  chartPlaceholder: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  emptyChartState: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyChartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptyChartSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyChartButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyChartButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  // Nudges
  nudgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  nudgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  resourceNudgeIcon: {
    backgroundColor: "#eef2ff",
  },
  mindfulnessNudgeIcon: {
    backgroundColor: "#ecfeff",
  },
  nudgeContent: {
    flex: 1,
  },
  nudgeCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0891b2",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nudgeMessage: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
    lineHeight: 22,
  },
  nudgeAction: {
    padding: 8,
  },
  nudgeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  nudgeStat: {
    alignItems: "center",
    flex: 1,
  },
  nudgeStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  nudgeStatLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  nudgeStatDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "31%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  // Bottom Padding
  bottomPadding: {
    height: 100,
  },
});

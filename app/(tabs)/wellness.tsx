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
import {
  GRADIENTS,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
  TYPOGRAPHY,
} from "@/lib/theme";

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
      color: COLORS.terracotta,
      bgColor: `${COLORS.terracotta}20`,
      route: "/(tabs)/trackers/mood" as any,
    },
    {
      id: "journal",
      title: "Journal",
      icon: "book" as const,
      color: COLORS.gold,
      bgColor: `${COLORS.gold}20`,
      route: "/(tabs)/journal",
    },
    {
      id: "breathe",
      title: "Breathe",
      icon: "moon" as const,
      color: COLORS.sage,
      bgColor: `${COLORS.sage}20`,
      route: "/",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness</Text>
        <TouchableOpacity
          onPress={resetDailyCards}
          style={styles.refreshButton}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color={COLORS.terracotta}
          />
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
          colors={[GRADIENTS.calm.start, GRADIENTS.calm.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.affirmationCard}
        >
          <View style={styles.affirmationHeader}>
            <View style={styles.affirmationBadge}>
              <Ionicons name="sparkles" size={16} color={COLORS.gold} />
              <Text style={styles.affirmationBadgeText}>Today's Insight</Text>
            </View>
            <View style={styles.aiToggleRow}>
              <Text style={styles.aiToggleLabel}>AI</Text>
              <Switch
                value={aiEnabled}
                onValueChange={(v) => void setEnabled({ enabled: v })}
                trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                thumbColor="#fff"
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
                  savedInsights.has(dailyInsight.id)
                    ? COLORS.terracotta
                    : TEXT.tertiary
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
                trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                thumbColor="#fff"
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
              <Ionicons name="heart-outline" size={14} color={TEXT.tertiary} />
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
          colors={[COLORS.gold, COLORS.terracotta]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.affirmationCard, styles.affirmationCardSecondary]}
        >
          <View style={styles.affirmationHeader}>
            <View style={styles.affirmationBadge}>
              <Ionicons name="sparkles" size={16} color={BACKGROUND.primary} />
              <Text
                style={[
                  styles.affirmationBadgeText,
                  styles.affirmationBadgeTextLight,
                ]}
              >
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
                    ? BACKGROUND.primary
                    : `${BACKGROUND.primary}99`
                }
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.affirmationMessage, styles.affirmationMessageLight]}
          >
            {dailyAffirmation.message}
          </Text>

          <View style={styles.affirmationMeta}>
            <View style={styles.affirmationMetaItem}>
              <Ionicons
                name="heart-outline"
                size={14}
                color={`${BACKGROUND.primary}99`}
              />
              <Text
                style={[
                  styles.affirmationMetaText,
                  styles.affirmationMetaTextLight,
                ]}
              >
                {dailyAffirmation.theme}
              </Text>
            </View>
            <Text style={[styles.affirmationDate, styles.affirmationDateLight]}>
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
            <Ionicons name="heart-outline" size={48} color={TEXT.tertiary} />
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
                <Ionicons name="book" size={24} color={COLORS.sage} />
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
            <Ionicons name="leaf" size={24} color={COLORS.sage} />
          </View>
          <View style={styles.nudgeContent}>
            <Text style={styles.nudgeCategory}>Mindfulness</Text>
            <Text style={styles.nudgeMessage}>{selfCareNudge.message}</Text>
          </View>
          <TouchableOpacity style={styles.nudgeAction}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={TEXT.tertiary}
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
    backgroundColor: BACKGROUND.primary,
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
    ...TYPOGRAPHY.headings.h1,
    color: TEXT.primary,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.terracotta}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  // Affirmation Section
  affirmationSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  affirmationCard: {
    borderRadius: RADIUS.xl,
    padding: 24,
    ...SHADOWS.md,
  },
  affirmationCardSecondary: {
    // Secondary gradient styling handled by parent
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
    backgroundColor: `${COLORS.gold}25`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  affirmationBadgeText: {
    fontSize: 12,
    fontFamily: "DMSansMedium",
    color: COLORS.gold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  affirmationBadgeTextLight: {
    color: BACKGROUND.primary,
  },
  aiToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiToggleLabel: {
    fontSize: 12,
    color: TEXT.secondary,
    fontFamily: "DMSans",
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
    color: TEXT.secondary,
    fontFamily: "DMSans",
  },
  testPushButton: {
    marginTop: 10,
    backgroundColor: BACKGROUND.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  testPushButtonText: {
    fontSize: 13,
    fontFamily: "DMSansMedium",
    color: TEXT.primary,
  },
  pushErrorText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.danger,
    fontFamily: "DMSans",
  },
  saveButton: {
    padding: 4,
  },
  affirmationMessage: {
    fontSize: 22,
    fontFamily: "CrimsonProMedium",
    color: TEXT.primary,
    lineHeight: 32,
    marginBottom: 20,
    fontStyle: "italic",
  },
  affirmationMessageLight: {
    color: BACKGROUND.primary,
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
    fontFamily: "DMSansMedium",
    color: TEXT.secondary,
    textTransform: "capitalize",
  },
  affirmationMetaTextLight: {
    color: `${BACKGROUND.primary}CC`,
  },
  affirmationDate: {
    fontSize: 12,
    fontFamily: "DMSans",
    color: TEXT.tertiary,
  },
  affirmationDateLight: {
    color: `${BACKGROUND.primary}99`,
  },
  // Check-In Button
  checkInButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  checkInButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.sage,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.md,
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
    fontFamily: "CrimsonProMedium",
    color: "#ffffff",
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans",
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
    ...TYPOGRAPHY.headings.h3,
    color: TEXT.primary,
  },
  sectionAction: {
    fontSize: 14,
    fontFamily: "DMSansMedium",
    color: COLORS.terracotta,
  },
  // Chart
  chartPlaceholder: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  loadingText: {
    fontSize: 14,
    color: TEXT.tertiary,
    fontFamily: "DMSans",
  },
  emptyChartState: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  emptyChartTitle: {
    fontSize: 16,
    fontFamily: "CrimsonProMedium",
    color: TEXT.secondary,
    marginTop: 16,
  },
  emptyChartSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans",
    color: TEXT.tertiary,
    marginTop: 4,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyChartButton: {
    backgroundColor: `${COLORS.terracotta}15`,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyChartButtonText: {
    fontSize: 14,
    fontFamily: "DMSansMedium",
    color: COLORS.terracotta,
  },
  // Nudges
  nudgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: GLASS.light.border,
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
    backgroundColor: `${COLORS.sage}15`,
  },
  mindfulnessNudgeIcon: {
    backgroundColor: `${COLORS.sage}15`,
  },
  nudgeContent: {
    flex: 1,
  },
  nudgeCategory: {
    fontSize: 11,
    fontFamily: "DMSansMedium",
    color: COLORS.sage,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nudgeMessage: {
    fontSize: 15,
    fontFamily: "DMSans",
    color: TEXT.primary,
    lineHeight: 22,
  },
  nudgeAction: {
    padding: 8,
  },
  nudgeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  nudgeStat: {
    alignItems: "center",
    flex: 1,
  },
  nudgeStatValue: {
    fontSize: 24,
    fontFamily: "CrimsonProBold",
    color: TEXT.primary,
    marginBottom: 4,
  },
  nudgeStatLabel: {
    fontSize: 12,
    fontFamily: "DMSans",
    color: TEXT.secondary,
  },
  nudgeStatDivider: {
    width: 1,
    backgroundColor: GLASS.light.border,
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
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: GLASS.light.border,
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
    fontFamily: "DMSansMedium",
    color: TEXT.primary,
  },
  // Bottom Padding
  bottomPadding: {
    height: 100,
  },
});

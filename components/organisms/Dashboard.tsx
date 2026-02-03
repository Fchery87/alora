import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VictoryPie } from "victory-native";
import { ReactNode } from "react";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { BACKGROUND, COLORS, TEXT } from "@/lib/theme";

interface DashboardStatsProps {
  todayFeeds?: number;
  todayDiapers?: number;
  todaySleep?: string;
  moodData?: { mood: string; count: number }[];
  activityFeed?: ReactNode;
}

export function Dashboard({
  todayFeeds = 0,
  todayDiapers = 0,
  todaySleep = "0h 0m",
  moodData = [],
  activityFeed,
}: DashboardStatsProps) {
  const quickActions = [
    {
      id: "feed",
      label: "Log Feed",
      icon: "restaurant",
      color: COLORS.terracotta,
      bgColor: "rgba(212, 165, 116, 0.15)",
    },
    {
      id: "diaper",
      label: "Log Diaper",
      icon: "water",
      color: COLORS.sage,
      bgColor: "rgba(139, 154, 125, 0.15)",
    },
    {
      id: "sleep",
      label: "Log Sleep",
      icon: "moon",
      color: COLORS.gold,
      bgColor: "rgba(201, 162, 39, 0.15)",
    },
    {
      id: "mood",
      label: "Check In",
      icon: "heart",
      color: COLORS.clay,
      bgColor: "rgba(193, 122, 92, 0.15)",
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: BACKGROUND.primary }}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="h1" color="primary" style={styles.welcomeText}>
        Welcome back, caregiver
      </Text>
      <Text variant="body" color="secondary" style={styles.welcomeSubtext}>
        Another beautiful day with your little one
      </Text>

      <View style={styles.section}>
        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: action.bgColor },
                ]}
              >
                <Ionicons
                  name={action.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text
                variant="caption"
                color="primary"
                style={styles.actionLabel}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          Today's Stats
        </Text>
        <View style={styles.statsRow}>
          <Card variant="soft" style={styles.statCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(212, 165, 116, 0.15)" },
              ]}
            >
              <Ionicons name="restaurant" size={20} color={COLORS.terracotta} />
            </View>
            <Text variant="h3" color="primary" style={styles.statNumber}>
              {todayFeeds}
            </Text>
            <Text variant="label" color="tertiary">
              Feeds
            </Text>
          </Card>

          <Card variant="soft" style={styles.statCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(139, 154, 125, 0.15)" },
              ]}
            >
              <Ionicons name="water" size={20} color={COLORS.sage} />
            </View>
            <Text variant="h3" color="primary" style={styles.statNumber}>
              {todayDiapers}
            </Text>
            <Text variant="label" color="tertiary">
              Diapers
            </Text>
          </Card>

          <Card variant="soft" style={styles.statCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(201, 162, 39, 0.15)" },
              ]}
            >
              <Ionicons name="moon" size={20} color={COLORS.gold} />
            </View>
            <Text
              variant="h3"
              color="primary"
              style={styles.statNumber}
              numberOfLines={1}
            >
              {todaySleep}
            </Text>
            <Text variant="label" color="tertiary">
              Sleep
            </Text>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="label" color="tertiary">
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text variant="caption" color="terracotta" style={styles.seeAll}>
              SEE ALL
            </Text>
          </TouchableOpacity>
        </View>

        {activityFeed || (
          <Card variant="elevated" style={styles.emptyActivityCard}>
            <Ionicons name="time-outline" size={48} color={TEXT.tertiary} />
            <Text variant="subtitle" color="primary" style={styles.emptyTitle}>
              No activity yet
            </Text>
            <Text
              variant="caption"
              color="secondary"
              style={styles.emptySubtext}
            >
              Tap a quick action above to start logging precious moments.
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          Mood Trends
        </Text>
        {moodData.length > 0 ? (
          <Card variant="soft" style={styles.moodCard}>
            <VictoryPie
              data={moodData}
              x="mood"
              y="count"
              innerRadius={60}
              padding={40}
              colorScale={[
                COLORS.sage, // Happy
                COLORS.terracotta,
                COLORS.gold, // Neutral
                COLORS.clay,
                "#A65A42", // Sad
              ]}
              style={{
                labels: {
                  fill: TEXT.primary,
                  fontSize: 12,
                  fontWeight: "bold",
                },
              }}
            />
          </Card>
        ) : (
          <Card variant="elevated" style={styles.moodPlaceholderCard}>
            <View style={styles.moodPlaceholderContent}>
              <View style={styles.moodIconContainer}>
                <Ionicons
                  name="happy-outline"
                  size={24}
                  color={TEXT.secondary}
                />
              </View>
              <View style={styles.moodTextContainer}>
                <Text variant="subtitle" color="primary">
                  Track Mood
                </Text>
                <Text variant="caption" color="secondary">
                  Start tracking to see weekly trends.
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={TEXT.tertiary}
              />
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeText: {
    marginBottom: 8,
  },
  welcomeSubtext: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
    shadowColor: "rgba(45, 42, 38, 0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  statNumber: {
    marginTop: 4,
    marginBottom: 2,
  },
  seeAll: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyActivityCard: {
    padding: 32,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
  },
  moodCard: {
    alignItems: "center",
    padding: 16,
  },
  moodPlaceholderCard: {
    padding: 16,
  },
  moodPlaceholderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(212, 165, 116, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  moodTextContainer: {
    flex: 1,
  },
});

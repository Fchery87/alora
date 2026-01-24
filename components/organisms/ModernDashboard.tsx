import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import {
  GRADIENTS,
  SHADOWS,
  RADIUS,
  TYPOGRAPHY,
  COLORS,
  SPACING,
} from "@/lib/theme";
import {
  staggeredFadeIn,
  staggeredScaleIn,
  softSpring,
  buttonPress,
  cardPress,
} from "@/lib/animations";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { AloraLogo } from "@/components/atoms/AloraLogo";

interface ModernDashboardProps {
  todayFeeds?: number;
  todayDiapers?: number;
  todaySleep?: string;
  moodTrend?: string;
  activityFeed?: React.ReactNode;
}

export function ModernDashboard({
  todayFeeds = 0,
  todayDiapers = 0,
  todaySleep = "0h 0m",
  moodTrend = "stable",
  activityFeed,
}: ModernDashboardProps) {
  const quickActions = useMemo(
    () => [
      { id: "feed", label: "Log Feed", icon: "restaurant", gradient: GRADIENTS.sunset },
      { id: "diaper", label: "Log Diaper", icon: "water", gradient: GRADIENTS.ocean },
      { id: "sleep", label: "Log Sleep", icon: "moon", gradient: GRADIENTS.lavender },
      { id: "mood", label: "Check In", icon: "heart", gradient: GRADIENTS.accent },
    ],
    []
  );

  const dailyStats = useMemo(
    () => [
      {
        id: "feeds",
        icon: "restaurant",
        gradient: GRADIENTS.sunset,
        value: todayFeeds,
        label: "Feeds",
        color: "#f43f5e",
        trend: "+2",
      },
      {
        id: "diapers",
        icon: "water",
        gradient: GRADIENTS.ocean,
        value: todayDiapers,
        label: "Diapers",
        color: "#0ea5e9",
        trend: "+1",
      },
      {
        id: "sleep",
        icon: "moon",
        gradient: GRADIENTS.lavender,
        value: todaySleep,
        label: "Sleep",
        color: "#8b5cf6",
        trend: "+30m",
      },
      {
        id: "mood",
        icon: "heart",
        gradient: GRADIENTS.calm,
        value: moodTrend,
        label: "Mood",
        color: "#a78bfa",
        trend: "↑",
      },
    ],
    [todayFeeds, todayDiapers, todaySleep, moodTrend]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo & Welcome */}
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: -10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ ...softSpring, delay: 100 }}
        style={styles.welcomeSection}
      >
        <View style={styles.logoContainer}>
          <AloraLogo size={80} showText={false} />
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.greeting}>Good evening!</Text>
          <Text style={styles.message}>Ready to nurture today?</Text>
        </View>
      </MotiView>

      {/* Today's Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.statsGrid}>
          {dailyStats.map((stat, index) => (
            <MotiView
              key={stat.id}
              {...staggeredScaleIn(index, 200)}
            >
              <GlassCard variant="default" size="md" style={styles.statCard}>
                <LinearGradient
                  colors={[stat.gradient.start, stat.gradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statIconBackground}
                >
                  <Ionicons name={stat.icon as any} size={24} color="#ffffff" />
                </LinearGradient>

                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>

                  {stat.trend && (
                    <View style={styles.trendBadge}>
                      <Text style={styles.trendText}>{stat.trend}</Text>
                    </View>
                  )}
                </View>
              </GlassCard>
            </MotiView>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <MotiView key={action.id} {...staggeredScaleIn(index, 400)}>
              <Pressable
                style={({ pressed }: { pressed: boolean }) => [
                  styles.quickActionButton,
                  cardPress(pressed),
                ] as any}
              >
                <LinearGradient
                  colors={[action.gradient.start, action.gradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.quickActionContent}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons
                      name={action.icon as any}
                      size={28}
                      color="#ffffff"
                    />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </View>
              </Pressable>
            </MotiView>
          ))}
        </View>
      </View>

      {/* Activity Feed */}
      {activityFeed && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activityFeed}
        </View>
      )}

      {/* Bottom spacing */}
      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
  },
  content: {
    padding: SPACING.md,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  greeting: {
    ...TYPOGRAPHY.headings.h2,
    color: COLORS.slate[800],
    marginBottom: 4,
  },
  message: {
    ...TYPOGRAPHY.body.regular,
    color: COLORS.slate[500],
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headings.h4,
    color: COLORS.slate[700],
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SPACING.xs,
  },
  statCard: {
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    overflow: "visible",
  },
  statIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    ...SHADOWS.glow,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    ...TYPOGRAPHY.headings.h3,
    color: COLORS.slate[900],
    marginBottom: 2,
  },
  statLabel: {
    ...TYPOGRAPHY.body.small,
    color: COLORS.slate[500],
    marginBottom: SPACING.xs,
  },
  trendBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendText: {
    ...TYPOGRAPHY.body.small,
    color: "#22c55e",
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SPACING.xs,
  },
  quickActionButton: {
    flex: 1,
    minWidth: "45%",
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    height: 100,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    position: "relative",
    ...SHADOWS.md,
  },
  quickActionContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  quickActionLabel: {
    ...TYPOGRAPHY.button,
    fontSize: 13,
    color: "#ffffff",
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

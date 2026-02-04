import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Skeleton,
  TextSkeleton,
  QuickActionSkeleton,
  StatCardSkeleton,
  CardSkeleton,
} from "@/components/atoms/Skeleton";
import { BACKGROUND, SPACING } from "@/lib/theme";

export function DashboardSkeleton() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Skeleton width={250} height={32} />
        <View style={styles.spacer} />
        <Skeleton width={200} height={16} />
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Skeleton width={100} height={12} style={styles.sectionLabel} />
        <View style={styles.quickActionsGrid}>
          <QuickActionSkeleton />
          <QuickActionSkeleton />
          <QuickActionSkeleton />
          <QuickActionSkeleton />
        </View>
      </View>

      {/* Today's Stats Section */}
      <View style={styles.section}>
        <Skeleton width={100} height={12} style={styles.sectionLabel} />
        <View style={styles.statsRow}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={100} height={12} />
          <Skeleton width={50} height={12} />
        </View>
        <CardSkeleton height={140} hasHeader={false} contentLines={4} />
      </View>

      {/* Mood Trends Section */}
      <View style={styles.section}>
        <Skeleton width={100} height={12} style={styles.sectionLabel} />
        <View style={styles.moodCard}>
          <View style={styles.moodPlaceholder}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <View style={styles.moodText}>
              <Skeleton width={100} height={18} />
              <View style={styles.spacerSmall} />
              <Skeleton width={180} height={14} />
            </View>
            <Skeleton width={24} height={24} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  spacer: {
    height: 8,
  },
  spacerSmall: {
    height: 4,
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  moodCard: {
    backgroundColor: BACKGROUND.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
  },
  moodPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moodText: {
    flex: 1,
  },
});

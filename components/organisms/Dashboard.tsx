import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { VictoryPie } from "victory-native";
import { ReactNode } from "react";

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
    { id: "feed", label: "Log Feed", icon: "restaurant", color: "#f97316" },
    { id: "diaper", label: "Log Diaper", icon: "water", color: "#3b82f6" },
    { id: "sleep", label: "Log Sleep", icon: "moon", color: "#8b5cf6" },
    { id: "mood", label: "Check In", icon: "heart", color: "#ec4899" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome back!</Text>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickActionButton}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${action.color}20` },
                ]}
              >
                <Ionicons
                  name={action.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.todaySection}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#ffedd5" }]}>
              <Ionicons name="restaurant" size={20} color="#ea580c" />
            </View>
            <Text style={styles.statValue}>{todayFeeds}</Text>
            <Text style={styles.statLabel}>Feeds</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="water" size={20} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>{todayDiapers}</Text>
            <Text style={styles.statLabel}>Diapers</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#ede9fe" }]}>
              <Ionicons name="moon" size={20} color="#7c3aed" />
            </View>
            <Text style={styles.statValue}>{todaySleep}</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {activityFeed || (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No activity yet today</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap a quick action above to get started
            </Text>
          </View>
        )}
      </View>

      <View style={styles.moodSection}>
        <Text style={styles.sectionTitle}>Your Mood This Week</Text>
        {moodData.length > 0 ? (
          <View style={styles.moodChart}>
            <VictoryPie
              data={moodData}
              x="mood"
              y="count"
              innerRadius={60}
              padding={20}
              colorScale={[
                "#10b981",
                "#6ee7b7",
                "#fcd34d",
                "#fb923c",
                "#f87171",
              ]}
            />
          </View>
        ) : (
          <View style={styles.emptyMoodState}>
            <Ionicons name="happy-outline" size={32} color="#d1d5db" />
            <Text style={styles.emptyMoodText}>
              Start tracking your mood to see trends
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionButton: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  todaySection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  moodSection: {
    marginBottom: 24,
  },
  moodChart: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyMoodState: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyMoodText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
});

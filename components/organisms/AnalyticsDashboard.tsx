import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { GrowthChart } from "./GrowthChart";
import { MoodTrendChart } from "./MoodTrendChart";
import { SleepTrendChart } from "./SleepTrendChart";
import { FeedingTrendChart } from "./FeedingTrendChart";
import { Ionicons } from "@expo/vector-icons";

type DateRange = "7d" | "30d" | "90d" | "all";

interface AnalyticsDashboardProps {
  growthData?: {
    data: {
      date: string;
      weight?: number;
      height?: number;
      headCirc?: number;
    }[];
    metric: "weight" | "height" | "headCirc";
    babyAgeInMonths: number;
  };
  moodData?: {
    date: string;
    mood: number;
    label?: string;
  }[];
  sleepData?: {
    date: string;
    totalHours: number;
    nightSleep: number;
    napSleep: number;
  }[];
  feedingData?: {
    date: string;
    totalFeeds: number;
    breastfeeding: number;
    bottle: number;
    pumping?: number;
  }[];
  isLoading?: boolean;
  error?: string;
}

const DATE_RANGES: { label: string; value: DateRange; icon: string }[] = [
  { label: "7 Days", value: "7d", icon: "calendar-outline" },
  { label: "30 Days", value: "30d", icon: "calendar" },
  { label: "90 Days", value: "90d", icon: "calendar-clear-outline" },
  { label: "All Time", value: "all", icon: "infinite" },
];

export function AnalyticsDashboard({
  growthData,
  moodData = [],
  sleepData = [],
  feedingData = [],
  isLoading = false,
  error,
}: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [selectedMetric, setSelectedMetric] = useState<
    "weight" | "height" | "headCirc"
  >("weight");

  const summaryStats = useMemo(() => {
    const moodAvg =
      moodData.length > 0
        ? moodData.reduce((acc, p) => acc + p.mood, 0) / moodData.length
        : 0;
    const sleepTotal = sleepData.reduce((acc, p) => acc + p.totalHours, 0);
    const sleepAvg = sleepData.length > 0 ? sleepTotal / sleepData.length : 0;
    const feedTotal = feedingData.reduce((acc, p) => acc + p.totalFeeds, 0);
    const feedAvg = feedingData.length > 0 ? feedTotal / feedingData.length : 0;

    return {
      moodAvg,
      sleepAvg,
      feedAvg,
      totalEntries: moodData.length + sleepData.length + feedingData.length,
    };
  }, [moodData, sleepData, feedingData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f87171" />
        <Text style={styles.errorText}>Unable to load analytics</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => {}}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 0 }}
      >
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>
          Track your baby's growth and patterns
        </Text>
      </MotiView>

      <View style={styles.dateSelectorContainer}>
        {DATE_RANGES.map((range, index) => (
          <MotiView
            key={range.value}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 100 + index * 50 }}
          >
            <Pressable
              style={[
                styles.dateButton,
                dateRange === range.value && styles.dateButtonActive,
              ]}
              onPress={() => setDateRange(range.value)}
            >
              <Ionicons
                name={range.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={dateRange === range.value ? "#ffffff" : "#64748b"}
              />
              <Text
                style={[
                  styles.dateButtonText,
                  dateRange === range.value && styles.dateButtonTextActive,
                ]}
              >
                {range.label}
              </Text>
            </Pressable>
          </MotiView>
        ))}
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 200 }}
        style={styles.summarySection}
      >
        <Text style={styles.sectionTitle}>This Period</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#ecfdf5" }]}>
              <Ionicons name="happy-outline" size={20} color="#10b981" />
            </View>
            <Text style={styles.summaryValue}>
              {summaryStats.moodAvg.toFixed(1)}
            </Text>
            <Text style={styles.summaryLabel}>Avg Mood</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#f5f3ff" }]}>
              <Ionicons name="moon-outline" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.summaryValue}>
              {summaryStats.sleepAvg.toFixed(1)}h
            </Text>
            <Text style={styles.summaryLabel}>Avg Sleep</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#fef2f2" }]}>
              <Ionicons name="restaurant-outline" size={20} color="#ef4444" />
            </View>
            <Text style={styles.summaryValue}>
              {summaryStats.feedAvg.toFixed(1)}
            </Text>
            <Text style={styles.summaryLabel}>Avg Feeds</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#eff6ff" }]}>
              <Ionicons name="stats-chart-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.summaryValue}>{summaryStats.totalEntries}</Text>
            <Text style={styles.summaryLabel}>Total Logs</Text>
          </View>
        </View>
      </MotiView>

      {growthData && (
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Growth</Text>
            <View style={styles.metricSelector}>
              {(["weight", "height", "headCirc"] as const).map((metric) => (
                <Pressable
                  key={metric}
                  style={[
                    styles.metricButton,
                    selectedMetric === metric && styles.metricButtonActive,
                  ]}
                  onPress={() => setSelectedMetric(metric)}
                >
                  <Text
                    style={[
                      styles.metricButtonText,
                      selectedMetric === metric &&
                        styles.metricButtonTextActive,
                    ]}
                  >
                    {metric === "weight"
                      ? "Weight"
                      : metric === "height"
                        ? "Length"
                        : "Head"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <GrowthChart
            data={growthData.data}
            metric={selectedMetric}
            babyAgeInMonths={growthData.babyAgeInMonths}
          />
        </View>
      )}

      <View style={styles.chartSection}>
        <MoodTrendChart
          data={moodData}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </View>

      <View style={styles.chartSection}>
        <SleepTrendChart
          data={sleepData}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </View>

      <View style={styles.chartSection}>
        <FeedingTrendChart
          data={feedingData}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </View>

      {moodData.length === 0 &&
        sleepData.length === 0 &&
        feedingData.length === 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 400 }}
            style={styles.emptyState}
          >
            <Ionicons name="analytics-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No data yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking to see your analytics
            </Text>
            <View style={styles.emptyStateTips}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.tipText}>Log feeds and diapers</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.tipText}>Track sleep times</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.tipText}>Check in with your mood</Text>
              </View>
            </View>
          </MotiView>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 20,
  },
  dateSelectorContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  dateButtonActive: {
    backgroundColor: "#8b5cf6",
  },
  dateButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  dateButtonTextActive: {
    color: "#ffffff",
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  metricSelector: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 4,
  },
  metricButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  metricButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  metricButtonTextActive: {
    color: "#1e293b",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  emptyStateTips: {
    marginTop: 24,
    gap: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#6b7280",
  },
});

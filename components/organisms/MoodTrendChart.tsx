import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
} from "victory-native";
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg";
import { MotiView } from "moti";

interface MoodDataPoint {
  date: string;
  mood: number;
  label?: string;
}

type DateRange = "7d" | "30d" | "90d" | "all";

interface MoodTrendChartProps {
  data: MoodDataPoint[];
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 200;

const MOOD_CONFIG = {
  1: { label: "Struggling", color: "#f87171", bgColor: "#fef2f2" },
  2: { label: "Low", color: "#fb923c", bgColor: "#fff7ed" },
  3: { label: "Okay", color: "#fbbf24", bgColor: "#fefce8" },
  4: { label: "Good", color: "#a3e635", bgColor: "#f0fdf4" },
  5: { label: "Great", color: "#10b981", bgColor: "#ecfdf5" },
};

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "All", value: "all" },
];

export function MoodTrendChart({
  data,
  dateRange = "7d",
  onDateRangeChange,
}: MoodTrendChartProps) {
  const chartWidth = SCREEN_WIDTH - 48;

  const filteredData = useMemo(() => {
    const now = new Date();
    const daysMap: Record<Exclude<DateRange, "all">, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    };
    const cutoffDate =
      dateRange === "all"
        ? null
        : new Date(
            now.getTime() - daysMap[dateRange] * 24 * 60 * 60 * 1000
          );

    return data
      .filter((point) =>
        cutoffDate ? new Date(point.date) >= cutoffDate : true
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((point, index) => ({
        ...point,
        x: index,
        y: point.mood,
        dateLabel: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [data, dateRange]);

  const averageMood = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, point) => acc + point.y, 0);
    return sum / filteredData.length;
  }, [filteredData]);

  const moodTrend = useMemo(() => {
    if (filteredData.length < 2) return "stable";
    const recent = filteredData.slice(-3);
    const older = filteredData.slice(-6, -3);
    if (older.length === 0) return "stable";
    const recentAvg = recent.reduce((acc, p) => acc + p.y, 0) / recent.length;
    const olderAvg = older.reduce((acc, p) => acc + p.y, 0) / older.length;
    if (recentAvg > olderAvg + 0.3) return "improving";
    if (recentAvg < olderAvg - 0.3) return "declining";
    return "stable";
  }, [filteredData]);

  const trendColor = {
    improving: "#10b981",
    declining: "#f87171",
    stable: "#64748b",
  }[moodTrend];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 100 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mood Trends</Text>
          <View
            style={[styles.trendBadge, { backgroundColor: `${trendColor}15` }]}
          >
            <View style={[styles.trendDot, { backgroundColor: trendColor }]} />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {moodTrend === "improving"
                ? "Improving"
                : moodTrend === "declining"
                  ? "Declining"
                  : "Stable"}
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Average: {averageMood.toFixed(1)} / 5
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={CHART_HEIGHT}
          theme={VictoryTheme.grayscale}
          padding={{ top: 10, bottom: 30, left: 40, right: 20 }}
        >
          <VictoryArea
            data={filteredData}
            y={(d) => d.y}
            style={{
              data: {
                fill: "url(#moodGradient)",
                stroke: "#10b981",
                strokeWidth: 2,
              },
            }}
            interpolation="catmullRom"
          />

          <VictoryLine
            data={filteredData}
            y={(d) => d.y}
            style={{
              data: {
                stroke: "#10b981",
                strokeWidth: 2,
              },
            }}
            interpolation="catmullRom"
          />

          <VictoryAxis
            dependentAxis
            domain={[1, 5]}
            tickValues={[1, 2, 3, 4, 5]}
            tickFormat={(value) =>
              MOOD_CONFIG[value as 1 | 2 | 3 | 4 | 5]?.label || ""
            }
            style={{
              axis: { stroke: "#e5e7eb" },
              tickLabels: {
                fill: "#6b7280",
                fontSize: 10,
                fontWeight: "500",
              },
              grid: { stroke: "#f3f4f6" },
            }}
          />

          <VictoryAxis
            tickValues={
              filteredData.length > 0
                ? filteredData
                    .filter(
                      (_, i) => i % Math.ceil(filteredData.length / 5) === 0
                    )
                    .map((_, i) => i * Math.ceil(filteredData.length / 5))
                : []
            }
            tickFormat={(index) =>
              filteredData[index as number]?.dateLabel || ""
            }
            style={{
              axis: { stroke: "#e5e7eb" },
              tickLabels: {
                fill: "#6b7280",
                fontSize: 10,
                angle: -45,
                textAnchor: "end",
              },
            }}
          />

          <View style={styles.defsContainer}>
            <Svg width="0" height="0">
              <Defs>
                <LinearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </LinearGradient>
              </Defs>
            </Svg>
          </View>
        </VictoryChart>
      </View>

      <View style={styles.dateSelector}>
        {DATE_RANGES.map((range) => (
          <Pressable
            key={range.value}
            style={[
              styles.dateButton,
              dateRange === range.value && styles.dateButtonActive,
            ]}
            onPress={() => onDateRangeChange?.(range.value)}
          >
            <Text
              style={[
                styles.dateButtonText,
                dateRange === range.value && styles.dateButtonTextActive,
              ]}
            >
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredData.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No mood data for this period
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Start tracking to see your mood trends
          </Text>
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  chartContainer: {
    alignItems: "center",
  },
  defsContainer: {
    position: "absolute",
    width: 0,
    height: 0,
  },
  dateSelector: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  dateButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  dateButtonTextActive: {
    color: "#1e293b",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});

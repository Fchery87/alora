import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from "victory-native";
import { MotiView } from "moti";

interface FeedingDataPoint {
  date: string;
  totalFeeds: number;
  breastfeeding: number;
  bottle: number;
  pumping?: number;
}

type DateRange = "7d" | "30d" | "90d" | "all";

interface FeedingTrendChartProps {
  data: FeedingDataPoint[];
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 220;

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "All", value: "all" },
];

export function FeedingTrendChart({
  data,
  dateRange = "7d",
  onDateRangeChange,
}: FeedingTrendChartProps) {
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
        dateLabel: new Date(point.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        breastfeeding: point.breastfeeding || 0,
        bottle: point.bottle || 0,
      }));
  }, [data, dateRange]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        average: 0,
        total: 0,
        breastfeedingAvg: 0,
        bottleAvg: 0,
        breastfeedingPct: 0,
        bottlePct: 0,
      };
    }
    const totalFeeds = filteredData.reduce((acc, p) => acc + p.totalFeeds, 0);
    const bfTotal = filteredData.reduce((acc, p) => acc + p.breastfeeding, 0);
    const bottleTotal = filteredData.reduce((acc, p) => acc + p.bottle, 0);
    return {
      average: totalFeeds / filteredData.length,
      total: totalFeeds,
      breastfeedingAvg: bfTotal / filteredData.length,
      bottleAvg: bottleTotal / filteredData.length,
      breastfeedingPct: totalFeeds > 0 ? (bfTotal / totalFeeds) * 100 : 0,
      bottlePct: totalFeeds > 0 ? (bottleTotal / totalFeeds) * 100 : 0,
    };
  }, [filteredData]);

  const feedingPattern = useMemo(() => {
    if (stats.average >= 10) return { label: "Frequent", color: "#10b981" };
    if (stats.average >= 8) return { label: "Regular", color: "#84cc16" };
    if (stats.average >= 6) return { label: "Moderate", color: "#fbbf24" };
    return { label: "Low", color: "#f87171" };
  }, [stats.average]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200, dampingRatio: 0.8 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Feeding Trends</Text>
        <View style={styles.patternBadge}>
          <View
            style={[
              styles.patternDot,
              { backgroundColor: feedingPattern.color },
            ]}
          />
          <Text style={[styles.patternText, { color: feedingPattern.color }]}>
            {feedingPattern.label}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.average.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg / day</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#ec4899" }]}>
            {stats.breastfeedingPct.toFixed(0)}%
          </Text>
          <Text style={styles.statLabel}>Breast</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#3b82f6" }]}>
            {stats.bottlePct.toFixed(0)}%
          </Text>
          <Text style={styles.statLabel}>Bottle</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={CHART_HEIGHT}
          theme={VictoryTheme.grayscale}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryStack
            style={{
              data: {
                strokeWidth: 0,
              },
            }}
          >
            <VictoryBar
              data={filteredData}
              x="x"
              y="breastfeeding"
              barWidth={12}
              cornerRadius={4}
              style={{
                data: {
                  fill: "#ec4899",
                },
              }}
            />
            <VictoryBar
              data={filteredData}
              x="x"
              y="bottle"
              barWidth={12}
              cornerRadius={4}
              style={{
                data: {
                  fill: "#3b82f6",
                },
              }}
            />
          </VictoryStack>

          <VictoryAxis
            dependentAxis
            tickFormat={(value) => `${value}`}
            domain={[0, Math.max(14, stats.average * 1.5)]}
            style={{
              axis: { stroke: "#e5e7eb" },
              tickLabels: {
                fill: "#6b7280",
                fontSize: 11,
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
                fontSize: 9,
                angle: -45,
                textAnchor: "end",
              },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#ec4899" }]} />
          <Text style={styles.legendText}>Breast</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#3b82f6" }]} />
          <Text style={styles.legendText}>Bottle</Text>
        </View>
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
            No feeding data for this period
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Start tracking to see feeding trends
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  patternBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  patternText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#fecaca",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  chartContainer: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
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

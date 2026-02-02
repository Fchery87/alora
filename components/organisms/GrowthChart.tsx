import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryArea,
  VictoryTheme,
  VictoryScatter,
} from "victory-native";
import { MotiView } from "moti";

interface GrowthDataPoint {
  date: string;
  weight?: number;
  height?: number;
  headCirc?: number;
}

interface WHOPercentile {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

interface GrowthChartProps {
  data: GrowthDataPoint[];
  metric: "weight" | "height" | "headCirc";
  babyAgeInMonths: number;
  showPercentiles?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 280;

const WHO_PERCENTILES: Record<string, Record<number, WHOPercentile>> = {
  weight: {
    0: { p10: 2.5, p25: 2.8, p50: 3.3, p75: 3.7, p90: 4.2 },
    1: { p10: 3.4, p25: 3.7, p50: 4.5, p75: 5.1, p90: 5.8 },
    2: { p10: 4.3, p25: 4.7, p50: 5.6, p75: 6.4, p90: 7.2 },
    3: { p10: 5.0, p25: 5.6, p50: 6.4, p75: 7.4, p90: 8.3 },
    4: { p10: 5.6, p25: 6.2, p50: 7.0, p75: 8.0, p90: 9.0 },
    5: { p10: 6.0, p25: 6.7, p50: 7.5, p75: 8.6, p90: 9.7 },
    6: { p10: 6.4, p25: 7.1, p50: 7.9, p75: 9.0, p90: 10.2 },
    9: { p10: 7.1, p25: 7.9, p50: 8.9, p75: 10.2, p90: 11.5 },
    12: { p10: 7.7, p25: 8.5, p50: 9.6, p75: 11.0, p90: 12.3 },
  },
  height: {
    0: { p10: 46.1, p25: 47.4, p50: 49.9, p75: 52.0, p90: 54.0 },
    1: { p10: 50.8, p25: 52.0, p50: 54.7, p75: 57.0, p90: 59.0 },
    2: { p10: 54.4, p25: 55.8, p50: 58.4, p75: 60.8, p90: 63.0 },
    3: { p10: 57.3, p25: 58.7, p50: 61.4, p75: 63.9, p90: 66.2 },
    4: { p10: 59.7, p25: 61.2, p50: 63.9, p75: 66.4, p90: 68.8 },
    5: { p10: 61.7, p25: 63.3, p50: 66.0, p75: 68.5, p90: 71.0 },
    6: { p10: 63.3, p25: 64.8, p50: 67.6, p75: 70.1, p90: 72.6 },
    9: { p10: 65.6, p25: 67.4, p50: 70.1, p75: 72.8, p90: 75.5 },
    12: { p10: 67.5, p25: 69.3, p50: 72.3, p75: 75.3, p90: 78.1 },
  },
  headCirc: {
    0: { p10: 32.1, p25: 33.1, p50: 34.5, p75: 35.9, p90: 36.9 },
    1: { p10: 35.1, p25: 36.1, p50: 37.3, p75: 38.6, p90: 39.6 },
    2: { p10: 37.0, p25: 38.0, p50: 39.1, p75: 40.5, p90: 41.5 },
    3: { p10: 38.3, p25: 39.3, p50: 40.5, p75: 41.8, p90: 42.8 },
    4: { p10: 39.4, p25: 40.4, p50: 41.5, p75: 42.8, p90: 43.8 },
    5: { p10: 40.3, p25: 41.3, p50: 42.4, p75: 43.6, p90: 44.6 },
    6: { p10: 41.0, p25: 42.0, p50: 43.0, p75: 44.2, p90: 45.2 },
    9: { p10: 42.1, p25: 43.0, p50: 44.1, p75: 45.3, p90: 46.3 },
    12: { p10: 42.9, p25: 43.8, p50: 44.9, p75: 46.1, p90: 47.1 },
  },
};

const METRIC_CONFIG = {
  weight: {
    label: "Weight",
    unit: "kg",
    color: "#8b5cf6",
    lineColor: "#7c3aed",
    areaColor: "rgba(139, 92, 246, 0.1)",
    percentiles: WHO_PERCENTILES.weight,
  },
  height: {
    label: "Length",
    unit: "cm",
    color: "#3b82f6",
    lineColor: "#2563eb",
    areaColor: "rgba(59, 130, 246, 0.1)",
    percentiles: WHO_PERCENTILES.height,
  },
  headCirc: {
    label: "Head",
    unit: "cm",
    color: "#10b981",
    lineColor: "#059669",
    areaColor: "rgba(16, 185, 129, 0.1)",
    percentiles: WHO_PERCENTILES.headCirc,
  },
};

export function GrowthChart({
  data,
  metric,
  babyAgeInMonths,
  showPercentiles = true,
}: GrowthChartProps) {
  const config = METRIC_CONFIG[metric];
  const chartWidth = SCREEN_WIDTH - 48;

  const processedData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      x: index,
      y: point[metric] || 0,
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data, metric]);

  const percentileData = useMemo((): WHOPercentile | null => {
    if (!showPercentiles) return null;
    const nearestMonth = Object.keys(config.percentiles)
      .map(Number)
      .reduce((prev, curr) =>
        Math.abs(curr - babyAgeInMonths) < Math.abs(prev - babyAgeInMonths)
          ? curr
          : prev
      );
    return config.percentiles[nearestMonth];
  }, [showPercentiles, config.percentiles, babyAgeInMonths]);

  const percentileAreaData = useMemo((): {
    x: number;
    y0: number;
    y: number;
  }[] => {
    if (!percentileData || processedData.length === 0) return [];
    const xValues = processedData.map((_, i) => i);
    return xValues.map((x) => ({
      x,
      y0: percentileData.p25,
      y: percentileData.p75,
    }));
  }, [percentileData, processedData]);

  const [selectedPoint, setSelectedPoint] = useState<
    (typeof processedData)[0] | null
  >(null);

  const formatYAxis = (value: number) => `${value.toFixed(1)} ${config.unit}`;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200, dampingRatio: 0.8 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{config.label} Growth</Text>
        <Text style={styles.subtitle}>Percentile bands show normal range</Text>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={CHART_HEIGHT}
          theme={VictoryTheme.grayscale}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          {showPercentiles && percentileAreaData.length > 0 && (
            <VictoryArea
              data={percentileAreaData}
              style={{
                data: {
                  fill: config.areaColor,
                  stroke: "transparent",
                },
              }}
              interpolation="catmullRom"
            />
          )}

          {showPercentiles && percentileData && (
            <>
              <VictoryLine
                data={[
                  { x: 0, y: percentileData.p90 },
                  { x: processedData.length - 1, y: percentileData.p90 },
                ]}
                style={{
                  data: {
                    stroke: "#fbbf24",
                    strokeWidth: 1,
                    strokeDasharray: "4,4",
                  },
                }}
              />
              <VictoryLine
                data={[
                  { x: 0, y: percentileData.p75 },
                  { x: processedData.length - 1, y: percentileData.p75 },
                ]}
                style={{
                  data: {
                    stroke: "#a7f3d0",
                    strokeWidth: 1,
                    strokeDasharray: "4,4",
                  },
                }}
              />
              <VictoryLine
                data={[
                  { x: 0, y: percentileData.p50 },
                  { x: processedData.length - 1, y: percentileData.p50 },
                ]}
                style={{
                  data: {
                    stroke: "#6ee7b7",
                    strokeWidth: 2,
                    strokeDasharray: "2,2",
                  },
                }}
              />
              <VictoryLine
                data={[
                  { x: 0, y: percentileData.p25 },
                  { x: processedData.length - 1, y: percentileData.p25 },
                ]}
                style={{
                  data: {
                    stroke: "#a7f3d0",
                    strokeWidth: 1,
                    strokeDasharray: "4,4",
                  },
                }}
              />
              <VictoryLine
                data={[
                  { x: 0, y: percentileData.p10 },
                  { x: processedData.length - 1, y: percentileData.p10 },
                ]}
                style={{
                  data: {
                    stroke: "#fca5a5",
                    strokeWidth: 1,
                    strokeDasharray: "4,4",
                  },
                }}
              />
            </>
          )}

          <VictoryLine
            data={processedData}
            style={{
              data: {
                stroke: config.lineColor,
                strokeWidth: 3,
              },
            }}
            interpolation="catmullRom"
          />

          <VictoryScatter
            data={processedData}
            size={6}
            style={{
              data: {
                fill: config.color,
                stroke: "#fff",
                strokeWidth: 2,
              },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={formatYAxis}
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
            tickValues={processedData.map((_, i) => i)}
            tickFormat={processedData.map((d) => d.date)}
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
        </VictoryChart>
      </View>

      {selectedPoint && selectedPoint.y > 0 && (
        <Pressable
          style={styles.tooltip}
          onPress={() => setSelectedPoint(null)}
        >
          <Text style={styles.tooltipTitle}>{selectedPoint.date}</Text>
          <Text style={styles.tooltipValue}>
            {selectedPoint.y.toFixed(2)} {config.unit}
          </Text>
          {percentileData && (
            <Text style={styles.tooltipPercentile}>
              {getPercentileLabel(selectedPoint.y, percentileData, config.unit)}
            </Text>
          )}
        </Pressable>
      )}

      {showPercentiles && percentileData && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.legendLineMedian]} />
            <Text style={styles.legendText}>50th percentile</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.legendLineHigh]} />
            <Text style={styles.legendText}>90th</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.legendLineLow]} />
            <Text style={styles.legendText}>10th</Text>
          </View>
        </View>
      )}
    </MotiView>
  );
}

function getPercentileLabel(
  value: number,
  percentile: WHOPercentile,
  unit: string
): string {
  if (value >= percentile.p90) return `~95th percentile`;
  if (value >= percentile.p75) return `~85th percentile`;
  if (value >= percentile.p50) return `~60th percentile`;
  if (value >= percentile.p25) return `~35th percentile`;
  if (value >= percentile.p10) return `~15th percentile`;
  return `~5th percentile`;
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  chartContainer: {
    alignItems: "center",
  },
  tooltip: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
  },
  tooltipTitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  tooltipPercentile: {
    fontSize: 11,
    color: "#a78bfa",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendLine: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  legendLineMedian: {
    backgroundColor: "#6ee7b7",
  },
  legendLineHigh: {
    backgroundColor: "#fbbf24",
  },
  legendLineLow: {
    backgroundColor: "#fca5a5",
  },
  legendText: {
    fontSize: 11,
    color: "#64748b",
  },
});

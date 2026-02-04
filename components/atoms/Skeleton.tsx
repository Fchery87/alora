import React from "react";
import { View, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { RADIUS, BACKGROUND, GLASS } from "@/lib/theme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function ShimmerEffect({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.shimmerContainer}>
      {children}
      <MotiView
        from={{ translateX: -200 }}
        animate={{ translateX: 200 }}
        transition={{
          type: "timing",
          duration: 1500,
          loop: true,
          repeatReverse: false,
        }}
        style={styles.shimmer}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>
    </View>
  );
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = RADIUS.sm,
  style,
}: SkeletonProps) {
  return (
    <ShimmerEffect>
      <View
        style={[
          styles.skeleton,
          {
            width,
            height,
            borderRadius,
          },
          style,
        ]}
      />
    </ShimmerEffect>
  );
}

export function TextSkeleton({
  lines = 1,
  width = "100%",
  height = 16,
  gap = 8,
  lastLineWidth = "80%",
}: {
  lines?: number;
  width?: DimensionValue;
  height?: number;
  gap?: number;
  lastLineWidth?: DimensionValue;
}) {
  return (
    <View style={[styles.textContainer, { gap }]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? lastLineWidth : width}
          height={height}
        />
      ))}
    </View>
  );
}

export function AvatarSkeleton({
  size = 48,
  rounded = false,
}: {
  size?: number;
  rounded?: boolean;
}) {
  return (
    <ShimmerEffect>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: rounded ? size / 2 : RADIUS.lg,
          },
        ]}
      />
    </ShimmerEffect>
  );
}

export function CardSkeleton({
  height = 120,
  hasHeader = true,
  hasContent = true,
  contentLines = 3,
}: {
  height?: number;
  hasHeader?: boolean;
  hasContent?: boolean;
  contentLines?: number;
}) {
  return (
    <View style={[styles.card, { height }]}>
      {hasHeader && (
        <View style={styles.cardHeader}>
          <AvatarSkeleton size={40} rounded />
          <View style={styles.headerText}>
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
      )}
      {hasContent && (
        <View style={styles.cardContent}>
          <TextSkeleton lines={contentLines} height={12} gap={6} />
        </View>
      )}
    </View>
  );
}

export function ButtonSkeleton({
  width = "100%",
  height = 48,
}: {
  width?: DimensionValue;
  height?: number;
}) {
  return <Skeleton width={width} height={height} borderRadius={RADIUS.lg} />;
}

export function IconSkeleton({
  size = 24,
  rounded = true,
}: {
  size?: number;
  rounded?: boolean;
}) {
  return (
    <ShimmerEffect>
      <View
        style={[
          styles.icon,
          {
            width: size,
            height: size,
            borderRadius: rounded ? size / 2 : RADIUS.sm,
          },
        ]}
      />
    </ShimmerEffect>
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <IconSkeleton size={48} rounded />
      <Skeleton width={40} height={28} style={styles.statNumber} />
      <Skeleton width={60} height={12} />
    </View>
  );
}

export function QuickActionSkeleton() {
  return (
    <View style={styles.quickAction}>
      <IconSkeleton size={48} rounded />
      <Skeleton width={70} height={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  shimmerContainer: {
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 200,
    height: "100%",
  },
  skeleton: {
    backgroundColor: BACKGROUND.tertiary,
    overflow: "hidden",
  },
  textContainer: {
    width: "100%",
  },
  avatar: {
    backgroundColor: BACKGROUND.tertiary,
    overflow: "hidden",
  },
  card: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  cardContent: {
    flex: 1,
  },
  icon: {
    backgroundColor: BACKGROUND.tertiary,
    overflow: "hidden",
  },
  statCard: {
    flex: 1,
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GLASS.light.border,
    gap: 4,
  },
  statNumber: {
    marginTop: 4,
    marginBottom: 2,
  },
  quickAction: {
    width: "48%",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
    gap: 8,
  },
});

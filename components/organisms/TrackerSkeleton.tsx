import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  IconSkeleton,
} from "@/components/atoms/Skeleton";
import { BACKGROUND, SPACING, RADIUS } from "@/lib/theme";

function TrackerCardSkeleton() {
  return (
    <View style={styles.trackerCard}>
      <IconSkeleton size={56} rounded />
      <View style={styles.spacer} />
      <Skeleton width={80} height={20} />
      <View style={styles.spacerSmall} />
      <Skeleton width={120} height={14} />
    </View>
  );
}

export function TrackerSkeleton() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Skeleton width={180} height={32} />
        <View style={styles.spacer} />
        <Skeleton width={250} height={16} />
      </View>

      {/* Trackers Grid */}
      <View style={styles.trackersGrid}>
        <TrackerCardSkeleton />
        <TrackerCardSkeleton />
        <TrackerCardSkeleton />
        <TrackerCardSkeleton />
        <TrackerCardSkeleton />
        <TrackerCardSkeleton />
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
    padding: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 28,
  },
  spacer: {
    height: 8,
  },
  spacerSmall: {
    height: 4,
  },
  trackersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  trackerCard: {
    width: "47%",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.15)",
    shadowColor: "rgba(45, 42, 38, 0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
});

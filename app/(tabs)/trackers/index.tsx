import React from "react";
import { ScrollView, StyleSheet, View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";
import { color, font, radius, space, typeScale } from "@/lib/design/careJournal/tokens";

type TrackerLink = {
  key: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  ink: string;
  wash: string;
};

const TRACKERS: TrackerLink[] = [
  {
    key: "feed",
    title: "Feeding",
    description: "Breast, bottle, solids",
    icon: "restaurant",
    href: "/(tabs)/trackers/feed",
    ink: color.pigment.clay,
    wash: "rgba(196, 106, 74, 0.12)",
  },
  {
    key: "diaper",
    title: "Diaper",
    description: "Wet, dirty, mixed",
    icon: "water",
    href: "/(tabs)/trackers/diaper",
    ink: color.pigment.sage,
    wash: "rgba(47, 107, 91, 0.12)",
  },
  {
    key: "sleep",
    title: "Sleep",
    description: "Naps & night",
    icon: "moon",
    href: "/(tabs)/trackers/sleep",
    ink: color.pigment.marigold,
    wash: "rgba(209, 165, 69, 0.14)",
  },
  {
    key: "mood",
    title: "Mood",
    description: "Quick check-in",
    icon: "heart",
    href: "/(tabs)/trackers/mood",
    ink: color.pigment.skyInfo,
    wash: "rgba(47, 94, 140, 0.12)",
  },
  {
    key: "growth",
    title: "Growth",
    description: "Weight, length, head",
    icon: "analytics",
    href: "/(tabs)/trackers/growth",
    ink: color.pigment.marigold,
    wash: "rgba(209, 165, 69, 0.14)",
  },
  {
    key: "milestones",
    title: "Milestones",
    description: "Firsts & progress",
    icon: "trophy",
    href: "/(tabs)/trackers/milestones",
    ink: color.ink.strong,
    wash: "rgba(31, 35, 40, 0.08)",
  },
];

function TrackerTile({
  title,
  description,
  icon,
  href,
  ink,
  wash,
}: TrackerLink) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${title}`}
      onPress={() => router.push(href as any)}
      style={({ pressed }) => [
        styles.tile,
        pressed ? styles.tilePressed : null,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: wash }]}>
        <Ionicons name={icon} size={18} color={ink} />
      </View>
      <Text style={styles.tileTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.tileDesc} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.cornerArrow} pointerEvents="none">
        <Ionicons name="arrow-forward" size={16} color={color.ink.faint} />
      </View>
    </Pressable>
  );
}

export default function TrackersIndexScreen() {
  return (
    <JournalScaffold
      title="Track"
      subtitle="Stamp a moment. Keep the day legible."
      testID="care-journal-trackers"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Stamps</Text>
        <View style={styles.grid}>
          {TRACKERS.map((tracker) => (
            <View key={tracker.key} style={styles.gridItem}>
              <TrackerTile {...tracker} />
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          Tip: pick one stamp, log the minimum, get back to the baby.
        </Text>
      </ScrollView>
    </JournalScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[2],
    paddingBottom: space[7],
  },
  sectionLabel: {
    marginTop: space[2],
    marginBottom: space[2],
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[2],
  },
  gridItem: {
    width: "48%",
  },
  tile: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[3],
    overflow: "hidden",
  },
  tilePressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space[2],
  },
  tileTitle: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
  },
  tileDesc: {
    marginTop: 4,
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  cornerArrow: {
    position: "absolute",
    right: space[3],
    top: space[3],
  },
  note: {
    marginTop: space[4],
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
});


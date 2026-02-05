import React, { type ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";
import { LogRow } from "@/components/care-journal/LogRow";
import { StampButton } from "@/components/care-journal/StampButton";
import {
  color,
  font,
  radius,
  space,
  typeScale,
} from "@/lib/design/careJournal/tokens";

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
  return (
    <JournalScaffold
      title="Today"
      subtitle="Stamp the moments. See the rhythm."
      testID="care-journal-dashboard"
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Stamps</Text>
        <View style={styles.stampsRow}>
          <StampButton
            label="Feed"
            onPress={() => {}}
            left={
              <Ionicons
                name="restaurant"
                size={16}
                color={color.pigment.clay}
              />
            }
          />
          <StampButton
            label="Diaper"
            onPress={() => {}}
            left={
              <Ionicons name="water" size={16} color={color.pigment.sage} />
            }
          />
          <StampButton
            label="Sleep"
            onPress={() => {}}
            left={
              <Ionicons
                name="moon"
                size={16}
                color={color.pigment.marigold}
              />
            }
          />
          <StampButton
            label="Check-in"
            onPress={() => {}}
            left={
              <Ionicons name="heart" size={16} color={color.pigment.skyInfo} />
            }
          />
        </View>

        <Text style={styles.sectionLabel}>Today's summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, styles.summaryIconClay]}>
              <Ionicons
                name="restaurant"
                size={16}
                color={color.pigment.clay}
              />
            </View>
            <Text style={styles.summaryValue}>{todayFeeds}</Text>
            <Text style={styles.summaryLabel}>Feeds</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, styles.summaryIconSage]}>
              <Ionicons name="water" size={16} color={color.pigment.sage} />
            </View>
            <Text style={styles.summaryValue}>{todayDiapers}</Text>
            <Text style={styles.summaryLabel}>Diapers</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, styles.summaryIconMarigold]}>
              <Ionicons
                name="moon"
                size={16}
                color={color.pigment.marigold}
              />
            </View>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {todaySleep}
            </Text>
            <Text style={styles.summaryLabel}>Sleep</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Recent entries</Text>
        {activityFeed ? (
          <View style={styles.activitySlot}>{activityFeed}</View>
        ) : (
          <View style={styles.entriesCard}>
            <View style={styles.entryRule}>
              <LogRow
                time="3:12 AM"
                title="Bottle"
                value="4 oz"
                meta="Logged by you"
                visibility="shared"
              />
            </View>
            <View style={styles.entryRule}>
              <LogRow
                time="4:05 AM"
                title="Diaper"
                value="Wet"
                meta="Logged by you"
                visibility="shared"
              />
            </View>
            <LogRow
              time="5:18 AM"
              title="Sleep"
              value="Started"
              meta="Night"
              visibility="private"
            />
          </View>
        )}

        <Text style={styles.sectionLabel}>Care</Text>
        <View style={styles.careCard}>
          <View style={styles.careHeader}>
            <View style={styles.careIcon}>
              <Ionicons name="heart" size={18} color={color.pigment.clay} />
            </View>
            <View style={styles.careText}>
              <Text style={styles.careTitle}>Mood check-in</Text>
              <Text style={styles.careSubtitle}>
                A quick note for how you’re doing.
              </Text>
            </View>
          </View>
          <Text style={styles.careHint}>
            {moodData.length > 0 ? "Trends available in Wellness." : "Takes under 30 seconds."}
          </Text>
        </View>
      </ScrollView>
    </JournalScaffold>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: space[2],
    paddingBottom: space[7],
  },
  sectionLabel: {
    marginTop: space[4],
    marginBottom: space[2],
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
  stampsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[2],
  },
  summaryCard: {
    flexDirection: "row",
    gap: space[2],
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[3],
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space[2],
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space[2],
  },
  summaryIconClay: {
    backgroundColor: "rgba(196, 106, 74, 0.12)",
  },
  summaryIconSage: {
    backgroundColor: "rgba(47, 107, 91, 0.12)",
  },
  summaryIconMarigold: {
    backgroundColor: "rgba(209, 165, 69, 0.14)",
  },
  summaryValue: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
    fontVariant: ["tabular-nums"],
  },
  summaryLabel: {
    marginTop: 2,
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
  entriesCard: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    paddingHorizontal: space[3],
  },
  entryRule: {
    borderBottomWidth: 1,
    borderBottomColor: color.paper.edge,
  },
  activitySlot: {
    marginTop: 4,
  },
  careCard: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[3],
  },
  careHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  careIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(196, 106, 74, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  careText: {
    flex: 1,
  },
  careTitle: {
    fontFamily: font.ui.semibold,
    fontSize: typeScale.body.fontSize,
    lineHeight: typeScale.body.lineHeight,
    letterSpacing: typeScale.body.letterSpacing,
    color: color.ink.strong,
  },
  careSubtitle: {
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  careHint: {
    marginTop: space[2],
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: typeScale.caption.letterSpacing,
    color: color.ink.faint,
  },
});


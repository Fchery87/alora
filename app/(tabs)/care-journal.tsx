import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";
import { LogRow } from "@/components/care-journal/LogRow";
import { StampButton } from "@/components/care-journal/StampButton";
import { color, space } from "@/lib/design/careJournal/tokens";

type StampKind = "Feed" | "Diaper" | "Sleep";

export default function CareJournalDemoScreen() {
  const [active, setActive] = useState<StampKind>("Feed");

  const items = useMemo(
    () => [
      { time: "3:12 AM", title: "Bottle", value: "4 oz", meta: "Logged by Sam" },
      { time: "4:05 AM", title: "Diaper", value: "Wet", meta: "Notes: normal" },
      { time: "5:18 AM", title: "Sleep", value: "Started", meta: "Night" },
    ],
    []
  );

  return (
    <JournalScaffold
      title="Care Journal"
      subtitle="Design system demo"
      testID="care-journal-demo"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stamps}>
          {(["Feed", "Diaper", "Sleep"] as const).map((label) => (
            <StampButton
              key={label}
              label={label}
              active={active === label}
              onPress={() => setActive(label)}
              accessibilityLabel={`Select ${label}`}
            />
          ))}
        </View>

        <View style={styles.list}>
          {items.map((row, idx) => (
            <View
              key={`${row.time}-${row.title}`}
              style={[styles.row, idx !== items.length - 1 && styles.rowRule]}
            >
              <LogRow time={row.time} title={row.title} value={row.value} meta={row.meta} />
            </View>
          ))}
        </View>
      </ScrollView>
    </JournalScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: space[7],
  },
  stamps: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[2],
    marginTop: space[3],
    marginBottom: space[4],
  },
  list: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: 12,
    backgroundColor: color.paper.wash,
    paddingHorizontal: space[3],
  },
  row: {
    paddingVertical: 2,
  },
  rowRule: {
    borderBottomWidth: 1,
    borderBottomColor: color.paper.edge,
  },
});


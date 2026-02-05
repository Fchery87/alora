import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { color, font, space, typeScale } from "@/lib/design/careJournal/tokens";

type Visibility = "private" | "shared";

type LogRowProps = {
  time: string;
  title: string;
  value: string;
  meta?: string;
  visibility?: Visibility;
};

export function LogRow({ time, title, value, meta, visibility }: LogRowProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.mid}>
        <Text style={styles.title}>{title}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.value}>{value}</Text>
        {visibility ? (
          <Text style={styles.badge}>
            {visibility === "private" ? "Private" : "Shared"}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: space[3],
  },
  time: {
    width: 76,
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
    fontVariant: ["tabular-nums"],
  },
  mid: {
    flex: 1,
    paddingRight: space[2],
  },
  title: {
    fontFamily: font.ui.medium,
    fontSize: typeScale.body.fontSize,
    lineHeight: typeScale.body.lineHeight,
    letterSpacing: typeScale.body.letterSpacing,
    color: color.ink.strong,
  },
  meta: {
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: typeScale.caption.letterSpacing,
    color: color.ink.faint,
  },
  right: {
    alignItems: "flex-end",
  },
  value: {
    fontFamily: font.ui.medium,
    fontSize: typeScale.body.fontSize,
    lineHeight: typeScale.body.lineHeight,
    letterSpacing: typeScale.body.letterSpacing,
    color: color.ink.strong,
    fontVariant: ["tabular-nums"],
  },
  badge: {
    marginTop: 2,
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
});


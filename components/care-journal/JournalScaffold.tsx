import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { color, font, space, typeScale } from "@/lib/design/careJournal/tokens";

type JournalScaffoldProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
} & ViewProps;

export function JournalScaffold({
  title,
  subtitle,
  children,
  style,
  ...props
}: JournalScaffoldProps) {
  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.paper.base,
  },
  header: {
    paddingTop: space[4],
    paddingBottom: space[3],
    paddingHorizontal: space[5],
  },
  title: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h2.fontSize,
    lineHeight: typeScale.h2.lineHeight,
    letterSpacing: typeScale.h2.letterSpacing,
    color: color.ink.strong,
  },
  subtitle: {
    marginTop: space[1],
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  content: {
    flex: 1,
    paddingHorizontal: space[5],
  },
});


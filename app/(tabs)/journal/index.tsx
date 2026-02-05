import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";
import { color, font, radius, space, typeScale } from "@/lib/design/careJournal/tokens";

const writingPrompts = [
  { icon: "sparkles", text: "What made you smile today?" },
  { icon: "heart", text: "What's one thing you're grateful for?" },
  { icon: "trophy", text: "What was a challenge you overcame?" },
  { icon: "sunny", text: "What are you looking forward to?" },
];

export default function JournalScreen() {
  const router = useRouter();

  return (
    <JournalScaffold
      title="Journal"
      subtitle="A note now; a memory later."
      testID="care-journal-journal"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>New entry</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Write a new journal entry"
          onPress={() => router.push("/(tabs)/journal/new")}
          style={({ pressed }) => [styles.entryCard, pressed && styles.pressed]}
        >
          <View style={styles.entryIconWrap}>
            <Ionicons name="book" size={18} color={color.pigment.marigold} />
          </View>
          <View style={styles.entryText}>
            <Text style={styles.entryTitle}>Write a note</Text>
            <Text style={styles.entryDesc}>
              A few words about you, your baby, or the day.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={color.ink.faint} />
        </Pressable>

        <Text style={styles.sectionLabel}>Prompts</Text>
        <View style={styles.promptsGrid}>
          {writingPrompts.map((prompt) => (
            <View key={prompt.text} style={styles.promptItem}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Use writing prompt: ${prompt.text}`}
                onPress={() => router.push("/(tabs)/journal/new")}
                style={({ pressed }) => [
                  styles.promptCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.promptIconWrap}>
                  <Ionicons
                    name={prompt.icon as any}
                    size={16}
                    color={color.pigment.clay}
                  />
                </View>
                <Text style={styles.promptText} numberOfLines={3}>
                  {prompt.text}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Recent</Text>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons
              name="book-outline"
              size={20}
              color={color.pigment.marigold}
            />
          </View>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptySubtitle}>
            When you write, your notes will collect here.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Write your first journal entry"
            onPress={() => router.push("/(tabs)/journal/new")}
            style={({ pressed }) => [
              styles.emptyButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.emptyButtonText}>Write first entry</Text>
          </Pressable>
        </View>
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
    marginTop: space[4],
    marginBottom: space[2],
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: color.ink.faint,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  entryCard: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[3],
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
  },
  entryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(209, 165, 69, 0.14)",
  },
  entryText: {
    flex: 1,
  },
  entryTitle: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
  },
  entryDesc: {
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  promptsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[2],
  },
  promptItem: {
    width: "48%",
  },
  promptCard: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[3],
    overflow: "hidden",
  },
  promptIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196, 106, 74, 0.12)",
    marginBottom: space[2],
  },
  promptText: {
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    padding: space[4],
    alignItems: "center",
  },
  emptyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(209, 165, 69, 0.14)",
    marginBottom: space[2],
  },
  emptyTitle: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 6,
    marginBottom: space[3],
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
    textAlign: "center",
  },
  emptyButton: {
    minHeight: 44,
    paddingHorizontal: space[3],
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: color.pigment.clay,
  },
  emptyButtonText: {
    fontFamily: font.ui.semibold,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: 0.4,
    color: color.paper.base,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Skeleton,
  CardSkeleton,
  ButtonSkeleton,
  IconSkeleton,
} from "@/components/atoms/Skeleton";
import { BACKGROUND, SPACING, RADIUS } from "@/lib/theme";

function PromptCardSkeleton() {
  return (
    <View style={styles.promptCard}>
      <IconSkeleton size={44} rounded={true} />
      <View style={styles.spacerSmall} />
      <Skeleton width="90%" height={14} />
    </View>
  );
}

export function JournalSkeleton() {
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
        <Skeleton width="85%" height={16} />
      </View>

      {/* New Entry Card */}
      <View style={styles.entryCard}>
        <View style={styles.entryContent}>
          <IconSkeleton size={72} rounded={true} />
          <View style={styles.spacer} />
          <Skeleton width={100} height={20} />
          <View style={styles.spacerSmall} />
          <Skeleton width="80%" height={14} />
          <View style={styles.spacer} />
          <IconSkeleton size={40} rounded={true} />
        </View>
      </View>

      {/* Writing Prompts Section */}
      <View style={styles.promptsSection}>
        <Skeleton width={140} height={20} style={styles.sectionTitle} />
        <View style={styles.promptsGrid}>
          <PromptCardSkeleton />
          <PromptCardSkeleton />
          <PromptCardSkeleton />
          <PromptCardSkeleton />
        </View>
      </View>

      {/* Recent Entries Section */}
      <View style={styles.recentSection}>
        <Skeleton width={130} height={20} style={styles.sectionTitle} />
        <View style={styles.emptyCard}>
          <View style={styles.emptyState}>
            <IconSkeleton size={72} rounded={true} />
            <View style={styles.spacer} />
            <Skeleton width={120} height={18} />
            <View style={styles.spacerSmall} />
            <Skeleton width={200} height={14} />
            <View style={styles.spacer} />
            <ButtonSkeleton width={140} height={40} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 24,
  },
  spacer: {
    height: 8,
  },
  spacerSmall: {
    height: 4,
  },
  entryCard: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.15)",
  },
  entryContent: {
    alignItems: "center",
  },
  promptsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  promptsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  promptCard: {
    width: "47%",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.1)",
  },
  recentSection: {
    marginTop: 32,
  },
  emptyCard: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.1)",
  },
  emptyState: {
    alignItems: "center",
  },
});

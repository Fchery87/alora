import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import { ModernHeader } from "@/components/atoms/ModernHeader";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { JournalSkeleton } from "@/components/organisms";
import { COLORS, GRADIENTS, SHADOWS } from "@/lib/theme";

const writingPrompts = [
  { icon: "sparkles", text: "What made you smile today?" },
  { icon: "heart", text: "What's one thing you're grateful for?" },
  { icon: "trophy", text: "What was a challenge you overcame?" },
  { icon: "sunny", text: "What are you looking forward to?" },
];

export default function JournalScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <OrganicBackground>
        <View style={styles.screen}>
          <ModernHeader
            title="Journal"
            subtitle="Capture your thoughts and memories"
            showBackButton={false}
            backgroundColor="transparent"
          />
          <JournalSkeleton />
        </View>
      </OrganicBackground>
    );
  }

  return (
    <OrganicBackground>
      <View style={styles.screen}>
        <ModernHeader
          title="Journal"
          subtitle="Capture your thoughts and memories"
          showBackButton={false}
          backgroundColor="transparent"
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <Text variant="h1" color="primary" style={styles.title}>
              Quick Journal
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Capture your thoughts, gratitude, and milestones
            </Text>
          </MotiView>

          {/* New Entry Card */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, dampingRatio: 0.8, stiffness: 150 }}
          >
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/journal/new")}
              activeOpacity={0.8}
            >
              <Card variant="elevated" style={styles.entryCard}>
                <View style={styles.entryIconContainer}>
                  <GradientIcon
                    name="book"
                    size={28}
                    variant="accent"
                    animated={false}
                  />
                </View>
                <Text variant="h3" color="primary" style={styles.entryTitle}>
                  New Entry
                </Text>
                <Text
                  variant="caption"
                  color="tertiary"
                  style={styles.entryDescription}
                >
                  Write about your day, feelings, or baby's milestones
                </Text>
                <View style={styles.entryArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={COLORS.gold}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          </MotiView>

          {/* Writing Prompts Section */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400, dampingRatio: 0.8, stiffness: 150 }}
            style={styles.promptsSection}
          >
            <Text variant="h3" color="primary" style={styles.sectionTitle}>
              Writing Prompts
            </Text>

            <View style={styles.promptsGrid}>
              {writingPrompts.map((prompt, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{
                    delay: 500 + index * 80,
                    dampingRatio: 0.7,
                    stiffness: 180,
                  }}
                >
                  <TouchableOpacity
                    style={styles.cardWrapper}
                    onPress={() => router.push("/(tabs)/journal/new")}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" style={styles.promptCard}>
                      <LinearGradient
                        colors={[GRADIENTS.accent.start, GRADIENTS.accent.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.promptIconBg}
                      >
                        <Ionicons
                          name={prompt.icon as any}
                          size={18}
                          color="#ffffff"
                        />
                      </LinearGradient>
                      <Text
                        variant="body"
                        color="secondary"
                        style={styles.promptText}
                      >
                        {prompt.text}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Recent Entries Section */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, dampingRatio: 0.8, stiffness: 150 }}
            style={styles.recentSection}
          >
            <Text variant="h3" color="primary" style={styles.sectionTitle}>
              Recent Entries
            </Text>

            <Card variant="soft" style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <View
                  style={[
                    styles.emptyIconContainer,
                    { backgroundColor: `${COLORS.gold}20` },
                  ]}
                >
                  <Ionicons name="book-outline" size={32} color={COLORS.gold} />
                </View>
                <Text
                  variant="subtitle"
                  color="primary"
                  style={styles.emptyTitle}
                >
                  No entries yet
                </Text>
                <Text
                  variant="caption"
                  color="tertiary"
                  style={styles.emptySubtitle}
                >
                  Start writing to see your journal history
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => router.push("/(tabs)/journal/new")}
                >
                  <Text style={styles.emptyButtonText}>Write First Entry</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </MotiView>
        </ScrollView>
      </View>
    </OrganicBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  entryCard: {
    padding: 24,
    alignItems: "center",
    ...SHADOWS.md,
    marginBottom: 8,
  },
  entryIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${COLORS.gold}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  entryTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  entryDescription: {
    textAlign: "center",
    marginBottom: 16,
  },
  entryArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.gold}15`,
    justifyContent: "center",
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
  cardWrapper: {
    width: "47%",
  },
  promptCard: {
    padding: 16,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  promptIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  promptText: {
    textAlign: "center",
    fontSize: 13,
  },
  recentSection: {
    marginTop: 32,
  },
  emptyCard: {
    padding: 32,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 4,
  },
  emptySubtitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#ffffff",
    fontFamily: "OutfitSemiBold",
    fontSize: 14,
  },
});

import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import { ModernHeader } from "@/components/atoms/ModernHeader";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { TrackerSkeleton } from "@/components/organisms";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS, TEXT } from "@/lib/theme";
import { useState, useEffect } from "react";

const trackers = [
  {
    id: "feed",
    title: "Feeding",
    description: "Breast, bottle, or solid foods",
    icon: "restaurant",
    color: COLORS.terracotta,
    bgColor: "rgba(212, 165, 116, 0.15)",
    gradientVariant: "primary" as const,
    href: "/(tabs)/trackers/feed",
  },
  {
    id: "diaper",
    title: "Diaper",
    description: "Wet, dirty, or mixed diapers",
    icon: "water",
    color: COLORS.sage,
    bgColor: "rgba(139, 154, 125, 0.15)",
    gradientVariant: "secondary" as const,
    href: "/(tabs)/trackers/diaper",
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Naps and nighttime sleep",
    icon: "moon",
    color: COLORS.moss,
    bgColor: "rgba(107, 122, 107, 0.15)",
    gradientVariant: "calm" as const,
    href: "/(tabs)/trackers/sleep",
  },
  {
    id: "mood",
    title: "Mood",
    description: "How you're feeling",
    icon: "heart",
    color: COLORS.clay,
    bgColor: "rgba(193, 122, 92, 0.15)",
    gradientVariant: "danger" as const,
    href: "/(tabs)/trackers/mood",
  },
  {
    id: "growth",
    title: "Growth",
    description: "Weight, length, head circ.",
    icon: "analytics",
    color: COLORS.gold,
    bgColor: "rgba(201, 162, 39, 0.15)",
    gradientVariant: "accent" as const,
    href: "/(tabs)/trackers/growth",
  },
  {
    id: "milestones",
    title: "Milestones",
    description: "Track developmental milestones",
    icon: "trophy",
    color: COLORS.stone,
    bgColor: "rgba(155, 139, 123, 0.15)",
    gradientVariant: "success" as const,
    href: "/(tabs)/trackers/milestones",
  },
];

export default function TrackersIndexScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state - replace with actual data fetching logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <OrganicBackground>
        <View style={styles.screen}>
          <ModernHeader
            title="Trackers"
            subtitle="Monitor your baby's daily activities"
            showBackButton={false}
            backgroundColor="transparent"
          />
          <TrackerSkeleton />
        </View>
      </OrganicBackground>
    );
  }

  return (
    <OrganicBackground>
      <View style={styles.screen}>
        <ModernHeader
          title="Trackers"
          subtitle="Monitor your baby's daily activities"
          showBackButton={false}
          backgroundColor="transparent"
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <Text variant="h1" color="primary" style={styles.title}>
              Log Activity
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Track your baby's daily activities with ease
            </Text>
          </MotiView>

          <View style={styles.trackersGrid}>
            {trackers.map((tracker, index) => (
              <MotiView
                key={tracker.id}
                from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{
                  delay: 300 + index * 80,
                  dampingRatio: 0.7,
                  stiffness: 180,
                }}
              >
                <TouchableOpacity
                  style={styles.cardWrapper}
                  onPress={() => router.push(tracker.href as any)}
                  activeOpacity={0.8}
                >
                  <Card variant="elevated" style={styles.trackerCard}>
                    <View
                      style={[
                        styles.trackerIcon,
                        { backgroundColor: tracker.bgColor },
                      ]}
                    >
                      <GradientIcon
                        name={tracker.icon}
                        size={24}
                        variant={tracker.gradientVariant}
                        animated={false}
                      />
                    </View>
                    <Text
                      variant="h3"
                      color="primary"
                      style={styles.trackerTitle}
                    >
                      {tracker.title}
                    </Text>
                    <Text
                      variant="caption"
                      color="tertiary"
                      style={styles.trackerDescription}
                    >
                      {tracker.description}
                    </Text>
                  </Card>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
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
    marginBottom: 28,
  },
  trackersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  cardWrapper: {
    width: "47%",
  },
  trackerCard: {
    padding: 20,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  trackerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  trackerTitle: {
    marginBottom: 4,
    textAlign: "center",
  },
  trackerDescription: {
    textAlign: "center",
  },
});

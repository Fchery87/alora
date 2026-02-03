import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Header } from "@/components/layout/Header";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS } from "@/lib/theme";

const trackers = [
  {
    id: "feed",
    title: "Feeding",
    description: "Breast, bottle, or solid foods",
    icon: "restaurant",
    color: COLORS.terracotta,
    bgColor: "rgba(212, 165, 116, 0.15)",
    href: "/(tabs)/trackers/feed",
  },
  {
    id: "diaper",
    title: "Diaper",
    description: "Wet, dirty, or mixed diapers",
    icon: "water",
    color: COLORS.sage,
    bgColor: "rgba(139, 154, 125, 0.15)",
    href: "/(tabs)/trackers/diaper",
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Naps and nighttime sleep",
    icon: "moon",
    color: COLORS.moss,
    bgColor: "rgba(107, 122, 107, 0.15)",
    href: "/(tabs)/trackers/sleep",
  },
  {
    id: "mood",
    title: "Mood",
    description: "How you're feeling",
    icon: "heart",
    color: COLORS.clay,
    bgColor: "rgba(193, 122, 92, 0.15)",
    href: "/(tabs)/trackers/mood",
  },
  {
    id: "growth",
    title: "Growth",
    description: "Weight, length, head circ.",
    icon: "analytics",
    color: COLORS.gold,
    bgColor: "rgba(201, 162, 39, 0.15)",
    href: "/(tabs)/trackers/growth",
  },
  {
    id: "milestones",
    title: "Milestones",
    description: "Track developmental milestones",
    icon: "trophy",
    color: COLORS.stone,
    bgColor: "rgba(155, 139, 123, 0.15)",
    href: "/(tabs)/trackers/milestones",
  },
];

export default function TrackersIndexScreen() {
  const router = useRouter();

  return (
    <OrganicBackground>
      <View style={styles.screen}>
        <Header title="Trackers" showBackButton={false} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="h1" color="primary" style={styles.title}>
            Log Activity
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            Track your baby's daily activities
          </Text>

          <View style={styles.trackersGrid}>
            {trackers.map((tracker) => (
              <TouchableOpacity
                key={tracker.id}
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
                    <Ionicons
                      name={tracker.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={tracker.color}
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
    width: 56,
    height: 56,
    borderRadius: 28,
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

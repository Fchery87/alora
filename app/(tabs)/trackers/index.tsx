import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const trackers = [
  {
    id: "feed",
    title: "Feeding",
    description: "Breast, bottle, or solid foods",
    icon: "restaurant",
    color: "#f97316",
    bgStyle: "trackerIconFeed",
    href: "/(tabs)/trackers/feed",
  },
  {
    id: "diaper",
    title: "Diaper",
    description: "Wet, dirty, or mixed diapers",
    icon: "water",
    color: "#3b82f6",
    bgStyle: "trackerIconDiaper",
    href: "/(tabs)/trackers/diaper",
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Naps and nighttime sleep",
    icon: "moon",
    color: "#8b5cf6",
    bgStyle: "trackerIconSleep",
    href: "/(tabs)/trackers/sleep",
  },
  {
    id: "mood",
    title: "Mood",
    description: "How you're feeling",
    icon: "heart",
    color: "#ec4899",
    bgStyle: "trackerIconMood",
    href: "/(tabs)/trackers/mood",
  },
  {
    id: "growth",
    title: "Growth",
    description: "Weight, length, head circ.",
    icon: "analytics",
    color: "#22c55e",
    bgStyle: "trackerIconGrowth",
    href: "/(tabs)/trackers/growth",
  },
  {
    id: "milestones",
    title: "Milestones",
    description: "Track developmental milestones",
    icon: "trophy",
    color: "#f59e0b",
    bgStyle: "trackerIconMilestones",
    href: "/(tabs)/trackers/milestones",
  },
];

export default function TrackersIndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Header title="Trackers" showBackButton={false} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Log Activity</Text>
        <Text style={styles.subtitle}>Track your baby's daily activities</Text>

        <View style={styles.trackersGrid}>
          {trackers.map((tracker) => (
            <TouchableOpacity
              key={tracker.id}
              style={styles.trackerCard}
              onPress={() => router.push(tracker.href as any)}
            >
              <View
                style={[
                  styles.trackerIcon,
                  styles[tracker.bgStyle as keyof typeof styles] as any,
                ]}
              >
                <Ionicons
                  name={tracker.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={tracker.color}
                />
              </View>
              <Text style={styles.trackerTitle}>{tracker.title}</Text>
              <Text style={styles.trackerDescription}>
                {tracker.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
  },
  trackersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  trackerCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trackerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  trackerIconFeed: {
    backgroundColor: "#f9731620",
  },
  trackerIconDiaper: {
    backgroundColor: "#3b82f620",
  },
  trackerIconSleep: {
    backgroundColor: "#8b5cf620",
  },
  trackerIconMood: {
    backgroundColor: "#ec489920",
  },
  trackerIconGrowth: {
    backgroundColor: "#22c55e20",
  },
  trackerIconMilestones: {
    backgroundColor: "#f59e0b20",
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  trackerDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
});

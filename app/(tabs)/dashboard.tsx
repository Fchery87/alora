import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/organisms/Dashboard";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BACKGROUND, TEXT } from "@/lib/theme";

export default function DashboardScreen() {
  const babyId = useSelectedBabyId();

  return (
    <View style={styles.screen}>
      <Header title="Dashboard" showBackButton={false} />
      {babyId ? (
        <Dashboard
          todayFeeds={3}
          todayDiapers={5}
          todaySleep="2h 30m"
          activityFeed={<ActivityFeed babyId={babyId} limit={10} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No baby selected</Text>
          <Text style={styles.emptySubtext}>
            Select a baby to view your dashboard
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND.primary,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: TEXT.secondary,
  },
});

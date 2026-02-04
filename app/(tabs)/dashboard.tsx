import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { Dashboard, DashboardSkeleton } from "@/components/organisms";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BACKGROUND, TEXT } from "@/lib/theme";
import { useState, useEffect } from "react";

export default function DashboardScreen() {
  const babyId = useSelectedBabyId();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state - replace with actual data fetching logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <Header title="Dashboard" showBackButton={false} />
      {isLoading ? (
        <DashboardSkeleton />
      ) : babyId ? (
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

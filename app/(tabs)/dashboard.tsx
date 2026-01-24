import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/organisms/Dashboard";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { useSelectedBabyId } from "@/stores/babyStore";

export default function DashboardScreen() {
  const babyId = useSelectedBabyId();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Dashboard" showBackButton={false} />
      {babyId ? (
        <Dashboard
          todayFeeds={3}
          todayDiapers={5}
          todaySleep="2h 30m"
          activityFeed={<ActivityFeed babyId={babyId} limit={10} />}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No baby selected - Select a baby to view your dashboard</Text>
        </View>
      )}
    </View>
  );
}

import { View, Text } from "react-native";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/organisms/Dashboard";

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Home" showBackButton={false} />
      <Dashboard todayFeeds={3} todayDiapers={5} todaySleep="2h 30m" />
    </View>
  );
}

import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VictoryPie } from "victory-native";
import { ReactNode } from "react";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";

interface DashboardStatsProps {
  todayFeeds?: number;
  todayDiapers?: number;
  todaySleep?: string;
  moodData?: { mood: string; count: number }[];
  activityFeed?: ReactNode;
}

export function Dashboard({
  todayFeeds = 0,
  todayDiapers = 0,
  todaySleep = "0h 0m",
  moodData = [],
  activityFeed,
}: DashboardStatsProps) {
  const quickActions = [
    {
      id: "feed",
      label: "Log Feed",
      icon: "restaurant",
      color: "#f97316",
    },
    {
      id: "diaper",
      label: "Log Diaper",
      icon: "water",
      color: "#3b82f6",
    },
    {
      id: "sleep",
      label: "Log Sleep",
      icon: "moon",
      color: "#8b5cf6",
    },
    {
      id: "mood",
      label: "Check In",
      icon: "heart",
      color: "#ec4899",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-nano-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title" className="text-3xl font-bold text-white mb-6">
        Welcome back!
      </Text>

      <View className="mb-8">
        <Text
          variant="subtitle"
          className="text-nano-400 mb-4 font-semibold uppercase tracking-wider text-xs"
        >
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              className="w-[48%] bg-nano-900 border border-nano-800 rounded-2xl p-4 items-center shadow-sm active:scale-95"
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Ionicons
                  name={action.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text className="text-white font-semibold text-sm">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-8">
        <Text
          variant="subtitle"
          className="text-nano-400 mb-4 font-semibold uppercase tracking-wider text-xs"
        >
          Today&apos;s Stats
        </Text>
        <View className="flex-row gap-3">
          <Card variant="glass" className="flex-1 items-center p-4">
            <View className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-orange-500/20">
              <Ionicons name="restaurant" size={20} color="#f97316" />
            </View>
            <Text className="text-white text-xl font-bold">{todayFeeds}</Text>
            <Text className="text-nano-500 text-[10px] uppercase font-bold mt-1">
              Feeds
            </Text>
          </Card>

          <Card variant="glass" className="flex-1 items-center p-4">
            <View className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-blue-500/20">
              <Ionicons name="water" size={20} color="#3b82f6" />
            </View>
            <Text className="text-white text-xl font-bold">{todayDiapers}</Text>
            <Text className="text-nano-500 text-[10px] uppercase font-bold mt-1">
              Diapers
            </Text>
          </Card>

          <Card variant="glass" className="flex-1 items-center p-4">
            <View className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-purple-500/20">
              <Ionicons name="moon" size={20} color="#8b5cf6" />
            </View>
            <Text
              className="text-white text-xl font-bold text-center"
              numberOfLines={1}
            >
              {todaySleep}
            </Text>
            <Text className="text-nano-500 text-[10px] uppercase font-bold mt-1">
              Sleep
            </Text>
          </Card>
        </View>
      </View>

      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text
            variant="subtitle"
            className="text-nano-400 font-semibold uppercase tracking-wider text-xs"
          >
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text className="text-banana-500 text-xs font-bold">SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {activityFeed || (
          <Card
            variant="default"
            className="bg-nano-900 border-nano-800 p-8 items-center"
          >
            <Ionicons name="time-outline" size={48} color="#333" />
            <Text className="text-white font-semibold mt-4">
              No activity yet
            </Text>
            <Text className="text-nano-500 text-sm text-center mt-2">
              Tap a quick action above to start logging.
            </Text>
          </Card>
        )}
      </View>

      <View className="mb-0">
        <Text
          variant="subtitle"
          className="text-nano-400 mb-4 font-semibold uppercase tracking-wider text-xs"
        >
          Mood Trends
        </Text>
        {moodData.length > 0 ? (
          <Card variant="glass" className="items-center p-4">
            <VictoryPie
              data={moodData}
              x="mood"
              y="count"
              innerRadius={60}
              padding={40}
              colorScale={[
                "#10b981", // Happy
                "#6ee7b7",
                "#fcd34d", // Neutral
                "#fb923c",
                "#f87171", // Sad
              ]}
              style={{
                labels: { fill: "white", fontSize: 12, fontWeight: "bold" },
              }}
            />
          </Card>
        ) : (
          <Card
            variant="default"
            className="bg-nano-900 border-nano-800 p-6 items-center flex-row gap-4"
          >
            <View className="w-12 h-12 rounded-full bg-nano-800 items-center justify-center">
              <Ionicons name="happy-outline" size={24} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">Track Mood</Text>
              <Text className="text-nano-500 text-xs mt-1">
                Start tracking to see weekly trends.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#444" />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

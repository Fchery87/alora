import { Stack } from "expo-router";

export default function TrackersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Trackers",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="feed"
        options={{
          title: "Log Feeding",
          headerShown: true,
          headerTitle: "Log Feeding",
        }}
      />
      <Stack.Screen
        name="diaper"
        options={{
          title: "Log Diaper",
          headerShown: true,
          headerTitle: "Log Diaper",
        }}
      />
      <Stack.Screen
        name="sleep"
        options={{
          title: "Log Sleep",
          headerShown: true,
          headerTitle: "Log Sleep",
        }}
      />
      <Stack.Screen
        name="mood"
        options={{
          title: "Mood Check-In",
          headerShown: true,
          headerTitle: "Mood Check-In",
        }}
      />
      <Stack.Screen
        name="growth"
        options={{
          title: "Growth Tracking",
          headerShown: true,
          headerTitle: "Growth Tracking",
        }}
      />
      <Stack.Screen
        name="milestones"
        options={{
          title: "Milestones",
          headerShown: true,
          headerTitle: "Milestones",
        }}
      />
    </Stack>
  );
}

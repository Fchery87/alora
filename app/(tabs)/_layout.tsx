import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { ProtectedRoute } from "@/components/atoms/ProtectedRoute";
import { useTheme } from "@/components/providers/ThemeProvider";

// Custom animated tab icon component
function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <MotiView
      animate={{
        scale: focused ? 1.1 : 1,
        translateY: focused ? -4 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <View
        style={[styles.iconContainer, focused && styles.iconContainerFocused]}
      >
        <Ionicons name={name} size={size} color={color} />
      </View>
    </MotiView>
  );
}

export default function TabsLayout() {
  const { theme, isDark } = useTheme();

  return (
    <ProtectedRoute requireOrganization>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary, // Terracotta
          tabBarInactiveTintColor: isDark ? "#8A8580" : "#8B8B8B",
          tabBarStyle: [
            styles.tabBar,
            { backgroundColor: theme.background.primary },
          ],
          tabBarLabelStyle: styles.tabLabel,
          headerShown: false,
        }}
      >
        {/* Home - Dashboard */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name="home"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        {/* Track - All tracking features */}
        <Tabs.Screen
          name="trackers"
          options={{
            title: "Track",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name="pulse"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        {/* Calendar */}
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name="calendar"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        {/* Explore - Resources, Wellness, Sounds, Partner, Family */}
        <Tabs.Screen
          name="resources"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name="compass"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        {/* Profile - Profile & Settings combined */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name="person-circle"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        {/* Hidden screens - accessible via navigation but not shown in tab bar */}
        <Tabs.Screen
          name="partner-support"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="wellness"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="sounds"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="family"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    marginTop: 4,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(212, 165, 116, 0.15)",
  },
});

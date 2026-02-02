import React from "react";
import type { MotiTransition } from "@/lib/moti-types";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { GRADIENTS, SHADOWS, COLORS } from "@/lib/theme";
import { softSpring, iconTap } from "@/lib/animations";

interface TabItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradient: { start: string; end: string };
}

interface ModernTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: any;
  navigation: any;
}

const TABS: TabItem[] = [
  {
    id: "dashboard",
    label: "Home",
    icon: "home",
    color: "#6366f1",
    gradient: GRADIENTS.primary,
  },
  {
    id: "trackers",
    label: "Trackers",
    icon: "stats-chart",
    color: "#22c55e",
    gradient: GRADIENTS.secondary,
  },
  {
    id: "wellness",
    label: "Wellness",
    icon: "heart",
    color: "#f43f5e",
    gradient: GRADIENTS.accent,
  },
  {
    id: "journal",
    label: "Journal",
    icon: "book",
    color: "#8b5cf6",
    gradient: GRADIENTS.calm,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar",
    color: "#f59e0b",
    gradient: GRADIENTS.sunset,
  },
];

export function ModernTabBar({ state, navigation }: ModernTabBarProps) {
  const currentRoute = state.routes[state.index]?.key;

  return (
    <MotiView
      from={{ translateY: 100 }}
      animate={{ translateY: 0 }}
      transition={{ ...softSpring, delay: 300 } as MotiTransition}
      style={styles.container}
    >
      {/* Glass background */}
      <View style={styles.glassContainer}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(248, 250, 252, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Tab items */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab, index) => {
            const isActive = currentRoute?.includes(tab.id);

            return (
              <Pressable
                key={tab.id}
                onPress={() => navigation.navigate(tab.id)}
                style={({ pressed }) => [
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                  iconTap(pressed),
                ]}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <MotiView
                    from={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={
                      { ...softSpring, delay: index * 30 } as MotiTransition
                    }
                    style={[
                      styles.activeGlow,
                      styles[
                        `activeGlow_${tab.id}` as keyof typeof styles
                      ] as any,
                    ]}
                  />
                )}

                {/* Tab icon */}
                <View style={styles.iconWrapper}>
                  {isActive ? (
                    <LinearGradient
                      colors={[tab.gradient.start, tab.gradient.end]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconGradient}
                    >
                      <Ionicons
                        name={tab.icon as any}
                        size={22}
                        color="#ffffff"
                      />
                    </LinearGradient>
                  ) : (
                    <Ionicons
                      name={tab.icon as any}
                      size={22}
                      color={COLORS.slate[400]}
                    />
                  )}
                </View>

                {/* Tab label */}
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                    isActive &&
                      (styles[
                        `tabLabel_${tab.id}` as keyof typeof styles
                      ] as any),
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom safe area */}
      <View style={styles.safeArea} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  glassContainer: {
    ...SHADOWS.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  tabItemActive: {
    // Active state handled by children
  },
  activeGlow: {
    position: "absolute",
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: -1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    position: "relative",
    zIndex: 1,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.glow,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    textTransform: "capitalize",
  },
  tabLabelInactive: {
    color: COLORS.slate[400],
  },
  tabLabelActive: {
    fontWeight: "600",
  },
  tabLabel_dashboard: {
    color: "#6366f1",
  },
  tabLabel_trackers: {
    color: "#22c55e",
  },
  tabLabel_wellness: {
    color: "#f43f5e",
  },
  tabLabel_journal: {
    color: "#8b5cf6",
  },
  tabLabel_calendar: {
    color: "#f59e0b",
  },
  activeGlow_dashboard: {
    backgroundColor: "#6366f120",
  },
  activeGlow_trackers: {
    backgroundColor: "#22c55e20",
  },
  activeGlow_wellness: {
    backgroundColor: "#f43f5e20",
  },
  activeGlow_journal: {
    backgroundColor: "#8b5cf620",
  },
  activeGlow_calendar: {
    backgroundColor: "#f59e0b20",
  },
  safeArea: {
    height: 34,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

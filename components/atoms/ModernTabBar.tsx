import React from "react";
import type { MotiTransition } from "@/lib/moti-types";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import {
  GRADIENTS,
  SHADOWS,
  TEXT,
  BACKGROUND,
  GLASS,
  COLORS,
} from "@/lib/theme";
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
    color: COLORS.terracotta,
    gradient: GRADIENTS.primary,
  },
  {
    id: "trackers",
    label: "Trackers",
    icon: "stats-chart",
    color: COLORS.sage,
    gradient: GRADIENTS.secondary,
  },
  {
    id: "wellness",
    label: "Wellness",
    icon: "heart",
    color: COLORS.clay,
    gradient: GRADIENTS.accent,
  },
  {
    id: "journal",
    label: "Journal",
    icon: "book",
    color: COLORS.gold,
    gradient: GRADIENTS.calm,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar",
    color: COLORS.stone,
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
          colors={[GLASS.light.background, "rgba(250, 247, 242, 0.98)"]}
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
                      color={TEXT.tertiary}
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
    borderTopColor: GLASS.light.border,
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
    fontFamily: "DMSans",
    fontWeight: "500",
    marginTop: 2,
    textTransform: "capitalize",
  },
  tabLabelInactive: {
    color: TEXT.tertiary,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
  tabLabel_dashboard: {
    color: COLORS.terracotta,
  },
  tabLabel_trackers: {
    color: COLORS.sage,
  },
  tabLabel_wellness: {
    color: COLORS.clay,
  },
  tabLabel_journal: {
    color: COLORS.gold,
  },
  tabLabel_calendar: {
    color: COLORS.stone,
  },
  activeGlow_dashboard: {
    backgroundColor: `${COLORS.terracotta}25`,
  },
  activeGlow_trackers: {
    backgroundColor: `${COLORS.sage}25`,
  },
  activeGlow_wellness: {
    backgroundColor: `${COLORS.clay}25`,
  },
  activeGlow_journal: {
    backgroundColor: `${COLORS.gold}25`,
  },
  activeGlow_calendar: {
    backgroundColor: `${COLORS.stone}25`,
  },
  safeArea: {
    height: 34,
    backgroundColor: BACKGROUND.primary,
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

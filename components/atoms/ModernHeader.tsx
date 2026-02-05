import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import {
  SHADOWS,
  TYPOGRAPHY,
  TEXT,
  COLORS,
  BACKGROUND,
} from "@/lib/theme";
import { softSpring, iconTap } from "@/lib/animations";
import type { MotiTransition } from "@/lib/moti-types";
import { useTheme } from "@/components/providers/ThemeProvider";

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  backgroundColor?: "transparent" | "gradient" | "cream" | "glass";
}

export function ModernHeader({
  title,
  subtitle,
  showBackButton = false,
  showMenuButton = false,
  showNotifications = false,
  notificationCount = 0,
  onBackPress,
  onMenuPress,
  onNotificationPress,
  backgroundColor = "glass",
}: ModernHeaderProps) {
  const { theme } = useTheme();

  return (
    <MotiView
      from={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ ...softSpring, delay: 100 } as MotiTransition}
      style={[
        styles.container,
        backgroundColor === "transparent" && styles.transparentBg,
        backgroundColor === "cream" && styles.creamBg,
        backgroundColor !== "transparent" && {
          backgroundColor:
            backgroundColor === "gradient"
              ? theme.background.secondary
              : theme.background.primary,
          borderBottomColor: theme.background.tertiary,
        },
      ]}
    >
      {/* Left section - Back button */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [styles.iconButton, iconTap(pressed)]}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT.primary} />
          </Pressable>
        )}

        {/* Title section */}
        <View
          style={[
            styles.titleSection,
            showBackButton && styles.titleSectionWithBack,
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Right section - Actions */}
      <View style={styles.rightSection}>
        {showNotifications && (
          <Pressable
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.iconButton, iconTap(pressed)]}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={TEXT.primary}
            />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}

        {showMenuButton && (
          <Pressable
            onPress={onMenuPress}
            style={({ pressed }) => [styles.iconButton, iconTap(pressed)]}
          >
            <Ionicons name="menu-outline" size={24} color={TEXT.primary} />
          </Pressable>
        )}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60, // Status bar height
    paddingBottom: 12,
    minHeight: 100,
    position: "relative",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: BACKGROUND.tertiary,
  },
  transparentBg: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  creamBg: {
    backgroundColor: BACKGROUND.primary,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleSection: {
    flex: 1,
  },
  titleSectionWithBack: {
    marginLeft: 12,
  },
  title: {
    ...TYPOGRAPHY.headings.h3,
    color: TEXT.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.body.small,
    color: TEXT.secondary,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(196, 106, 74, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.clay,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    ...SHADOWS.sm,
  },
  notificationCount: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 20,
  },
});

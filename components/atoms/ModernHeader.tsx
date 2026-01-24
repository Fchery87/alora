import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { GRADIENTS, SHADOWS, RADIUS, TYPOGRAPHY, COLORS } from "@/lib/theme";
import { softSpring, iconTap } from "@/lib/animations";

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
  backgroundColor?: "transparent" | "gradient" | "white" | "glass";
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
  return (
    <MotiView
      from={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: "spring", 
        ...softSpring,
        delay: 100,
      }}
      style={[styles.container, backgroundColor === "transparent" && styles.transparentBg]}
    >
      {/* Gradient or glass background */}
      {backgroundColor === "gradient" && (
        <LinearGradient
          colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {backgroundColor === "glass" && (
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.85)", "rgba(248, 250, 252, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Left section - Back button */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [
              styles.iconButton,
              iconTap(pressed),
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
        )}

        {/* Title section */}
        <View style={[styles.titleSection, showBackButton && { marginLeft: 12 }]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Right section - Actions */}
      <View style={styles.rightSection}>
        {showNotifications && (
          <Pressable
            onPress={onNotificationPress}
            style={({ pressed }) => [
              styles.iconButton,
              iconTap(pressed),
            ]}
          >
            <Ionicons name="notifications-outline" size={24} color="#0f172a" />
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
            style={({ pressed }) => [
              styles.iconButton,
              iconTap(pressed),
            ]}
          >
            <Ionicons name="menu-outline" size={24} color="#0f172a" />
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
  },
  transparentBg: {
    backgroundColor: "transparent",
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
  title: {
    ...TYPOGRAPHY.headings.h3,
    color: "#0f172a",
  },
  subtitle: {
    ...TYPOGRAPHY.body.small,
    color: "#64748b",
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#f43f5e",
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
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

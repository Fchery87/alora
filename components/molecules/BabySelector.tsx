import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBaby } from "@/hooks/useBaby";

interface BabySelectorProps {
  onPress?: () => void;
}

/**
 * Compact baby selector for headers and toolbars
 * Shows baby avatar + name and opens full selector modal on press
 */
export function BabySelector({ onPress }: BabySelectorProps) {
  const { selectedBaby, babies } = useBaby();

  // Don't show selector if only one baby exists
  if (!selectedBaby || babies.length <= 1) {
    return null;
  }

  const initials = selectedBaby.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const CLAY = "#C17A5C";
  const warmCream = "#FAF6F1";
  const warmGray = "#6B6560";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        {selectedBaby.photoUrl ? (
          <Image
            source={{ uri: selectedBaby.photoUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.initials}>{initials}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {selectedBaby.name}
        </Text>
        {selectedBaby.age && <Text style={styles.age}>{selectedBaby.age}</Text>}
      </View>
      <Ionicons
        name="chevron-down"
        size={20}
        color={warmGray}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBF7", // warm cream
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 10,
    shadowColor: "#8B7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(193, 122, 92, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C17A5C",
  },
  info: {
    flex: 1,
    maxWidth: 120,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2A26",
  },
  age: {
    fontSize: 12,
    color: "#6B6560",
  },
  chevron: {
    marginLeft: 4,
  },
});

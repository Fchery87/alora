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
        color="#64748b"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e7ff",
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
    color: "#4f46e5",
  },
  info: {
    flex: 1,
    maxWidth: 120,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  age: {
    fontSize: 12,
    color: "#64748b",
  },
  chevron: {
    marginLeft: 4,
  },
});

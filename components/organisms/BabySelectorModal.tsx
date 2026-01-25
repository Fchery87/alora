import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBaby } from "@/hooks/useBaby";
import { CreateBaby } from "./CreateBaby";

interface BabySelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Full baby selector modal with list of babies
 * Shows all babies with avatars, ages, and allows selection
 */
export function BabySelectorModal({
  visible,
  onClose,
}: BabySelectorModalProps) {
  const { babies, selectedBabyId, selectBaby, calculateAge } = useBaby();
  const [showCreateBaby, setShowCreateBaby] = useState(false);

  const handleSelectBaby = (babyId: string) => {
    selectBaby(babyId);
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPastelColor = (index: number) => {
    const colors = [
      "#fce7f3", // Pink
      "#e0e7ff", // Indigo
      "#dcfce7", // Green
      "#fef3c7", // Yellow
      "#e0f2fe", // Sky
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index: number) => {
    const colors = [
      "#db2777", // Pink
      "#4f46e5", // Indigo
      "#059669", // Green
      "#d97706", // Yellow
      "#0284c7", // Sky
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Baby</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.babyList}>
              {babies.map((baby, index) => {
                const isSelected = baby._id === selectedBabyId;
                const age = calculateAge(baby.birthDate);
                const birthDate = new Date(baby.birthDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                return (
                  <TouchableOpacity
                    key={baby._id}
                    style={[
                      styles.babyCard,
                      isSelected && styles.babyCardSelected,
                    ]}
                    onPress={() => handleSelectBaby(baby._id)}
                  >
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: getPastelColor(index) },
                      ]}
                    >
                      {baby.photoUrl ? (
                        <Image
                          source={{ uri: baby.photoUrl }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text
                          style={[
                            styles.initials,
                            { color: getTextColor(index) },
                          ]}
                        >
                          {getInitials(baby.name)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.babyInfo}>
                      <Text
                        style={[
                          styles.babyName,
                          isSelected && styles.babyNameSelected,
                        ]}
                      >
                        {baby.name}
                      </Text>
                      <View style={styles.babyDetails}>
                        <Text style={styles.age}>{age}</Text>
                        <Text style={styles.birthDate}>{birthDate}</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#6366f1"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateBaby(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add New Baby</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CreateBaby
        visible={showCreateBaby}
        onClose={() => setShowCreateBaby(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  babyList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  babyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  babyCardSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: 20,
    fontWeight: "700",
  },
  babyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  babyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  babyNameSelected: {
    color: "#6366f1",
  },
  babyDetails: {
    flexDirection: "row",
    gap: 12,
  },
  age: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  birthDate: {
    fontSize: 14,
    color: "#94a3b8",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

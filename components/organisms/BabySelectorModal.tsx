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
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT } from "@/lib/theme";

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
      "rgba(196, 106, 74, 0.14)", // Clay wash
      "rgba(47, 107, 91, 0.14)", // Sage wash
      "rgba(209, 165, 69, 0.16)", // Marigold wash
      "rgba(47, 94, 140, 0.14)", // Sky wash
      "rgba(31, 35, 40, 0.08)", // Ink wash
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index: number) => {
    const colors = [
      COLORS.terracotta,
      COLORS.sage,
      COLORS.gold,
      COLORS.info,
      THEME_TEXT.primary,
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
                <Ionicons name="close" size={22} color={THEME_TEXT.primary} />
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
                        color={COLORS.terracotta}
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
              <Ionicons
                name="add-circle-outline"
                size={22}
                color={THEME_TEXT.primaryInverse}
              />
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
    backgroundColor: BACKGROUND.overlay,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: BACKGROUND.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 34,
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BACKGROUND.tertiary,
  },
  title: {
    fontSize: 20,
    fontFamily: "CareJournalHeadingMedium",
    color: THEME_TEXT.primary,
  },
  babyList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  babyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  babyCardSelected: {
    borderColor: COLORS.terracotta,
    backgroundColor: BACKGROUND.primary,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: 20,
    fontFamily: "CareJournalHeadingSemiBold",
  },
  babyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  babyName: {
    fontSize: 16,
    fontFamily: "CareJournalUISemiBold",
    color: THEME_TEXT.primary,
    marginBottom: 4,
  },
  babyNameSelected: {
    color: COLORS.terracotta,
  },
  babyDetails: {
    flexDirection: "row",
    gap: 12,
  },
  age: {
    fontSize: 14,
    color: THEME_TEXT.secondary,
    fontFamily: "CareJournalUIMedium",
  },
  birthDate: {
    fontSize: 14,
    color: THEME_TEXT.tertiary,
    fontFamily: "CareJournalUI",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.sm,
  },
  addButtonText: {
    color: THEME_TEXT.primaryInverse,
    fontSize: 15,
    fontFamily: "CareJournalUISemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientButton } from "@/components/atoms/GradientButton";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import {
  GRADIENTS,
  SHADOWS,
  RADIUS,
  GLASS,
  BACKGROUND,
  TEXT,
  COLORS,
  ANIMATION,
} from "@/lib/theme";

interface Diaper {
  id: string;
  type: string;
  color?: string;
  notes?: string;
  timestamp?: string | number;
}

interface DiaperDetailsModalProps {
  visible: boolean;
  diaper: Diaper | null;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: (id: string, updates: Partial<Diaper>) => void;
}

const DIAPER_TYPES = ["wet", "solid", "both", "mixed"];
const DIAPER_COLORS = ["yellow", "orange", "green", "brown", "red"];

const DIAPER_COLORS_MAP: Record<string, string> = {
  yellow: "#E4B453",
  orange: "#D4874C",
  green: "#8B9A7D",
  brown: "#7A5A3F",
  red: "#C17A5C",
};

export function DiaperDetailsModal({
  visible,
  diaper,
  onClose,
  onDelete,
  onEdit,
}: DiaperDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedType, setEditedType] = useState("");
  const [editedColor, setEditedColor] = useState("");
  const [editedNotes, setEditedNotes] = useState("");

  useEffect(() => {
    if (diaper) {
      setEditedType(diaper.type);
      setEditedColor(diaper.color || "");
      setEditedNotes(diaper.notes || "");
    }
    setIsEditing(false);
  }, [diaper]);

  const handleSave = () => {
    if (onEdit && diaper) {
      onEdit(diaper.id, {
        type: editedType,
        color: editedColor,
        notes: editedNotes,
      });
      setIsEditing(false);
    }
  };

  const formatDateTime = (timestamp: string | number | undefined) => {
    if (!timestamp) return "Unknown time";

    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!diaper) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: ANIMATION.medium }}
        style={styles.overlay}
      >
        <MotiView
          from={{ translateY: 300, opacity: 0 }}
          animate={{ translateY: visible ? 0 : 300, opacity: visible ? 1 : 0 }}
          transition={{
            type: "spring",
            dampingRatio: 0.8,
            stiffness: 150,
          }}
          style={styles.container}
        >
          <GlassCard
            variant="default"
            size="lg"
            animated={false}
            style={styles.card}
          >
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                  <GradientIcon
                    name="close-outline"
                    size={20}
                    variant="calm"
                    onPress={onClose}
                    animated={false}
                  />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Diaper Details</Text>
                {isEditing ? (
                  <TouchableOpacity
                    onPress={handleSave}
                    style={styles.iconButton}
                  >
                    <GradientIcon
                      name="checkmark-outline"
                      size={20}
                      variant="success"
                      onPress={handleSave}
                      animated={false}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={styles.iconButton}
                  >
                    <GradientIcon
                      name="create-outline"
                      size={20}
                      variant="primary"
                      onPress={() => setIsEditing(true)}
                      animated={false}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Content */}
              {!isEditing ? (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>Type</Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: `${COLORS.sage}20` },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: COLORS.sage }]}>
                        {diaper.type}
                      </Text>
                    </View>
                  </View>

                  {diaper.color && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Color</Text>
                      <View style={styles.colorContainer}>
                        <View
                          style={[
                            styles.colorDot,
                            {
                              backgroundColor:
                                DIAPER_COLORS_MAP[diaper.color] || COLORS.sage,
                            },
                          ]}
                        />
                        <Text style={styles.colorText}>{diaper.color}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.timeValue}>
                      {formatDateTime(diaper.timestamp)}
                    </Text>
                  </View>

                  {diaper.notes && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Notes</Text>
                      <Text style={styles.notes}>{diaper.notes}</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.chipsContainer}>
                      {DIAPER_TYPES.map((type, index) => (
                        <MotiView
                          key={type}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.chip,
                              editedType === type && [
                                styles.chipActive,
                                {
                                  backgroundColor: COLORS.sage,
                                  borderColor: COLORS.sage,
                                },
                              ],
                              editedType !== type && {
                                backgroundColor: `${COLORS.sage}15`,
                                borderColor: `${COLORS.sage}30`,
                              },
                            ]}
                            onPress={() => setEditedType(type)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                editedType === type && styles.chipTextActive,
                                editedType !== type && { color: COLORS.sage },
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        </MotiView>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.chipsContainer}>
                      {DIAPER_COLORS.map((color, index) => (
                        <MotiView
                          key={color}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.chip,
                              editedColor === color && [
                                styles.chipActive,
                                {
                                  backgroundColor: COLORS.sage,
                                  borderColor: COLORS.sage,
                                },
                              ],
                              editedColor !== color && {
                                backgroundColor: `${COLORS.sage}15`,
                                borderColor: `${COLORS.sage}30`,
                              },
                            ]}
                            onPress={() => setEditedColor(color)}
                          >
                            <View
                              style={[
                                styles.colorDotSmall,
                                { backgroundColor: DIAPER_COLORS_MAP[color] },
                              ]}
                            />
                            <Text
                              style={[
                                styles.chipText,
                                editedColor === color && styles.chipTextActive,
                                editedColor !== color && { color: COLORS.sage },
                              ]}
                            >
                              {color}
                            </Text>
                          </TouchableOpacity>
                        </MotiView>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                      style={styles.input}
                      value={editedNotes}
                      onChangeText={setEditedNotes}
                      placeholder="Add notes..."
                      placeholderTextColor={TEXT.tertiary}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {onDelete && !isEditing && (
                <GradientButton
                  variant="outline"
                  size="md"
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}
                  icon={
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={COLORS.clay}
                    />
                  }
                  style={styles.deleteButton}
                >
                  Delete
                </GradientButton>
              )}
            </View>
          </GlassCard>
        </MotiView>
      </MotiView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: BACKGROUND.overlay,
    justifyContent: "flex-end",
  },
  container: {
    maxHeight: "85%",
  },
  card: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    overflow: "hidden",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT.primary,
    fontFamily: "CrimsonProMedium",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT.secondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "DMSansMedium",
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
    fontFamily: "DMSansMedium",
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${COLORS.sage}15`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorText: {
    fontSize: 15,
    fontWeight: "500",
    color: TEXT.primary,
    textTransform: "capitalize",
    fontFamily: "DMSans",
  },
  timeValue: {
    fontSize: 15,
    color: TEXT.primary,
    lineHeight: 22,
    fontFamily: "DMSans",
  },
  notes: {
    fontSize: 15,
    color: TEXT.secondary,
    lineHeight: 22,
    fontFamily: "DMSans",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 8,
  },
  chipActive: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    fontFamily: "DMSans",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  colorDotSmall: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  input: {
    backgroundColor: BACKGROUND.card,
    borderWidth: 1,
    borderColor: `${COLORS.sage}40`,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: TEXT.primary,
    fontFamily: "DMSans",
    ...SHADOWS.sm,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.sage}20`,
  },
  deleteButton: {
    width: "100%",
  },
});

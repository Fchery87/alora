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

interface Sleep {
  id: string;
  type: string;
  quality?: string;
  duration?: number;
  notes?: string;
  startTime?: string | number;
  endTime?: string | number;
}

interface SleepDetailsModalProps {
  visible: boolean;
  sleep: Sleep | null;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: (id: string, updates: Partial<Sleep>) => void;
}

const SLEEP_TYPES = ["nap", "night", "day"];
const SLEEP_QUALITY = ["awake", "drowsy", "sleeping", "deep"];

export function SleepDetailsModal({
  visible,
  sleep,
  onClose,
  onDelete,
  onEdit,
}: SleepDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedType, setEditedType] = useState("");
  const [editedQuality, setEditedQuality] = useState("");
  const [editedNotes, setEditedNotes] = useState("");

  useEffect(() => {
    if (sleep) {
      setEditedType(sleep.type);
      setEditedQuality(sleep.quality || "");
      setEditedNotes(sleep.notes || "");
    }
    setIsEditing(false);
  }, [sleep]);

  const handleSave = () => {
    if (onEdit && sleep) {
      onEdit(sleep.id, {
        type: editedType,
        quality: editedQuality,
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

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return "Unknown duration";

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!sleep) return null;

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
                <Text style={styles.headerTitle}>Sleep Details</Text>
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
                        { backgroundColor: `${COLORS.moss}20` },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: COLORS.moss }]}>
                        {sleep.type}
                      </Text>
                    </View>
                  </View>

                  {sleep.quality && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Quality</Text>
                      <View
                        style={[
                          styles.qualityBadge,
                          { backgroundColor: getQualityColor(sleep.quality) },
                        ]}
                      >
                        <Text style={styles.qualityText}>{sleep.quality}</Text>
                      </View>
                    </View>
                  )}

                  {sleep.startTime && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Start Time</Text>
                      <Text style={styles.value}>
                        {formatDateTime(sleep.startTime)}
                      </Text>
                    </View>
                  )}

                  {sleep.endTime && (
                    <View style={styles.section}>
                      <Text style={styles.label}>End Time</Text>
                      <Text style={styles.value}>
                        {formatDateTime(sleep.endTime)}
                      </Text>
                    </View>
                  )}

                  {sleep.duration && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Duration</Text>
                      <Text style={styles.value}>
                        {formatDuration(sleep.duration)}
                      </Text>
                    </View>
                  )}

                  {sleep.notes && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Notes</Text>
                      <Text style={styles.notes}>{sleep.notes}</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.chipsContainer}>
                      {SLEEP_TYPES.map((type, index) => (
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
                                  backgroundColor: COLORS.moss,
                                  borderColor: COLORS.moss,
                                },
                              ],
                              editedType !== type && {
                                backgroundColor: `${COLORS.moss}15`,
                                borderColor: `${COLORS.moss}30`,
                              },
                            ]}
                            onPress={() => setEditedType(type)}
                          >
                            <Ionicons
                              name={getSleepIcon(type)}
                              size={16}
                              color={
                                editedType === type ? "#ffffff" : COLORS.moss
                              }
                            />
                            <Text
                              style={[
                                styles.chipText,
                                editedType === type && styles.chipTextActive,
                                editedType !== type && { color: COLORS.moss },
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
                    <Text style={styles.label}>Quality</Text>
                    <View style={styles.chipsContainer}>
                      {SLEEP_QUALITY.map((quality, index) => (
                        <MotiView
                          key={quality}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.chip,
                              editedQuality === quality && [
                                styles.chipActive,
                                {
                                  backgroundColor: COLORS.sage,
                                  borderColor: COLORS.sage,
                                },
                              ],
                              editedQuality !== quality && {
                                backgroundColor: `${COLORS.sage}15`,
                                borderColor: `${COLORS.sage}30`,
                              },
                            ]}
                            onPress={() => setEditedQuality(quality)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                editedQuality === quality &&
                                  styles.chipTextActive,
                                editedQuality !== quality && {
                                  color: COLORS.sage,
                                },
                              ]}
                            >
                              {quality}
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
                      placeholder="Add notes about sleep..."
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

const getQualityColor = (quality: string) => {
  const colors: Record<string, string> = {
    awake: `${COLORS.stone}30`,
    drowsy: `${COLORS.gold}30`,
    sleeping: `${COLORS.moss}30`,
    deep: `${COLORS.warmDark}30`,
  };
  return colors[quality] || `${COLORS.moss}30`;
};

const getSleepIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    nap: "moon-outline",
    night: "bed-outline",
    day: "sunny-outline",
  };
  return icons[type] || "bed-outline";
};

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
  qualityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
  },
  qualityText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT.primary,
    textTransform: "capitalize",
    fontFamily: "DMSansMedium",
  },
  value: {
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
  input: {
    backgroundColor: BACKGROUND.card,
    borderWidth: 1,
    borderColor: `${COLORS.moss}40`,
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

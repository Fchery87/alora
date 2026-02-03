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

const MOSS = "#6B7A6B";
const SAGE = "#8B9A7D";
const CLAY = "#C17A5C";
const GOLD = "#C9A227";
const TERRACOTTA = "#D4A574";

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
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-outline" size={24} color={MOSS} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Sleep Details</Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={24} color={SAGE} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color={MOSS} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {!isEditing ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Type</Text>
                  <View
                    style={[styles.badge, { backgroundColor: `${MOSS}20` }]}
                  >
                    <Text style={[styles.badgeText, { color: MOSS }]}>
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
                    {SLEEP_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          editedType === type && [
                            styles.chipActive,
                            { backgroundColor: MOSS, borderColor: MOSS },
                          ],
                          editedType !== type && {
                            backgroundColor: "rgba(107, 122, 107, 0.1)",
                            borderColor: "rgba(107, 122, 107, 0.3)",
                          },
                        ]}
                        onPress={() => setEditedType(type)}
                      >
                        <Ionicons
                          name={getSleepIcon(type)}
                          size={16}
                          color={editedType === type ? "#ffffff" : MOSS}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            editedType === type && styles.chipTextActive,
                            editedType !== type && { color: MOSS },
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Quality</Text>
                  <View style={styles.chipsContainer}>
                    {SLEEP_QUALITY.map((quality) => (
                      <TouchableOpacity
                        key={quality}
                        style={[
                          styles.chip,
                          editedQuality === quality && [
                            styles.chipActive,
                            { backgroundColor: SAGE, borderColor: SAGE },
                          ],
                          editedQuality !== quality && {
                            backgroundColor: "rgba(139, 154, 125, 0.1)",
                            borderColor: "rgba(139, 154, 125, 0.3)",
                          },
                        ]}
                        onPress={() => setEditedQuality(quality)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editedQuality === quality && styles.chipTextActive,
                            editedQuality !== quality && { color: SAGE },
                          ]}
                        >
                          {quality}
                        </Text>
                      </TouchableOpacity>
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
                    placeholderTextColor="#9B8B7A"
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
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  onDelete();
                  onClose();
                }}
              >
                <Ionicons name="trash-outline" size={20} color={CLAY} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getQualityColor = (quality: string) => {
  const colors: Record<string, string> = {
    awake: "rgba(155, 139, 122, 0.2)",
    drowsy: "rgba(201, 162, 39, 0.2)",
    sleeping: "rgba(107, 122, 107, 0.2)",
    deep: "rgba(93, 78, 55, 0.2)",
  };
  return colors[quality] || "rgba(107, 122, 107, 0.2)";
};

const getQualityTextColor = (quality: string) => {
  const colors: Record<string, string> = {
    awake: "#7A6A5A",
    drowsy: "#9A7A20",
    sleeping: "#6B7A6B",
    deep: "#5D4E37",
  };
  return colors[quality] || "#6B7A6B";
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
    backgroundColor: "rgba(45, 42, 38, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFBF7", // warm cream
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2A26",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B6560",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  qualityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  qualityText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2A26",
    textTransform: "capitalize",
  },
  value: {
    fontSize: 15,
    color: "#2D2A26",
    lineHeight: 22,
  },
  notes: {
    fontSize: 15,
    color: "#6B6560",
    lineHeight: 22,
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
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  chipActive: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(107, 122, 107, 0.3)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: "#2D2A26",
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 154, 125, 0.15)",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    backgroundColor: "rgba(193, 122, 92, 0.1)",
    borderRadius: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C17A5C",
  },
});

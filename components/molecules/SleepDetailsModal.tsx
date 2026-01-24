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
                <Ionicons name="close-outline" size={24} color="#6366f1" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Sleep Details</Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={24} color="#22c55e" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color="#6366f1" />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {!isEditing ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{sleep.type}</Text>
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
                    <Text style={styles.value}>{formatDateTime(sleep.startTime)}</Text>
                  </View>
                )}

                {sleep.endTime && (
                  <View style={styles.section}>
                    <Text style={styles.label}>End Time</Text>
                    <Text style={styles.value}>{formatDateTime(sleep.endTime)}</Text>
                  </View>
                )}

                {sleep.duration && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Duration</Text>
                    <Text style={styles.value}>{formatDuration(sleep.duration)}</Text>
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
                          editedType === type && styles.chipActive,
                        ]}
                        onPress={() => setEditedType(type)}
                      >
                        <Ionicons
                          name={getSleepIcon(type)}
                          size={16}
                          color={editedType === type ? "#ffffff" : "#475569"}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            editedType === type && styles.chipTextActive,
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
                          editedQuality === quality && styles.chipActive,
                        ]}
                        onPress={() => setEditedQuality(quality)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editedQuality === quality && styles.chipTextActive,
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
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
    awake: "#94a3b8",
    drowsy: "#fbbf24",
    sleeping: "#3b82f6",
    deep: "#1e40af",
  };
  return `${colors[quality] || "#6366f1"}20`;
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    textTransform: "capitalize",
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  qualityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    textTransform: "capitalize",
  },
  value: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 20,
  },
  notes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 6,
  },
  chipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  footer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
});

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
              <Text style={styles.headerTitle}>Diaper Details</Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color="#22c55e"
                  />
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
                    <Text style={styles.badgeText}>{diaper.type}</Text>
                  </View>
                </View>

                {diaper.color && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Color</Text>
                    <View
                      style={[
                        styles.colorDot,
                        (styles as any)[
                          `colorSwatch_${DIAPER_COLORS.includes(diaper.color) ? diaper.color : "default"}`
                        ],
                      ]}
                    />
                    <Text style={styles.value}>{diaper.color}</Text>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.value}>
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
                    {DIAPER_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          editedType === type && styles.chipActive,
                        ]}
                        onPress={() => setEditedType(type)}
                      >
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
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.chipsContainer}>
                    {DIAPER_COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.chip,
                          editedColor === color && styles.chipActive,
                        ]}
                        onPress={() => setEditedColor(color)}
                      >
                        <View
                          style={[
                            styles.colorDotSmall,
                            (styles as any)[`colorSwatch_${color}`],
                          ]}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            editedColor === color && styles.chipTextActive,
                          ]}
                        >
                          {color}
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
                    placeholder="Add notes..."
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
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
  colorDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  colorSwatch_default: {
    backgroundColor: "#6366f1",
  },
  colorSwatch_yellow: {
    backgroundColor: "#fbbf24",
  },
  colorSwatch_orange: {
    backgroundColor: "#f97316",
  },
  colorSwatch_green: {
    backgroundColor: "#22c55e",
  },
  colorSwatch_brown: {
    backgroundColor: "#a52a2a",
  },
  colorSwatch_red: {
    backgroundColor: "#ef4444",
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

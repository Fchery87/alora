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

const DIAPER_COLORS_MAP: Record<string, string> = {
  yellow: "#E4B453",
  orange: "#D4874C",
  green: "#8B9A7D",
  brown: "#7A5A3F",
  red: "#C17A5C",
};

const SAGE = "#8B9A7D";
const CLAY = "#C17A5C";

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
                <Ionicons name="close-outline" size={24} color={SAGE} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Diaper Details</Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={24} color={SAGE} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color={SAGE} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {!isEditing ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Type</Text>
                  <View
                    style={[styles.badge, { backgroundColor: `${SAGE}20` }]}
                  >
                    <Text style={[styles.badgeText, { color: SAGE }]}>
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
                              DIAPER_COLORS_MAP[diaper.color] || SAGE,
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
                    {DIAPER_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          editedType === type && [
                            styles.chipActive,
                            { backgroundColor: SAGE, borderColor: SAGE },
                          ],
                          editedType !== type && {
                            backgroundColor: "rgba(139, 154, 125, 0.1)",
                            borderColor: "rgba(139, 154, 125, 0.3)",
                          },
                        ]}
                        onPress={() => setEditedType(type)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editedType === type && styles.chipTextActive,
                            editedType !== type && { color: SAGE },
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
                          editedColor === color && [
                            styles.chipActive,
                            { backgroundColor: SAGE, borderColor: SAGE },
                          ],
                          editedColor !== color && {
                            backgroundColor: "rgba(139, 154, 125, 0.1)",
                            borderColor: "rgba(139, 154, 125, 0.3)",
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
                            editedColor !== color && { color: SAGE },
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
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(139, 154, 125, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
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
    color: "#2D2A26",
    textTransform: "capitalize",
  },
  timeValue: {
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
    textTransform: "capitalize",
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
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(139, 154, 125, 0.3)",
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

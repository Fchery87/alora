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

interface Growth {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  percentile?: number;
  notes?: string;
}

interface GrowthDetailsModalProps {
  visible: boolean;
  growth: Growth | null;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: (id: string, updates: Partial<Growth>) => void;
}

const GROWTH_TYPES = ["weight", "length", "head_circumference"];

const GROWTH_LABELS: Record<string, string> = {
  weight: "Weight",
  length: "Length",
  head_circumference: "Head Circumference",
};

const GROWTH_UNITS: Record<string, string[]> = {
  weight: ["kg", "lbs", "oz"],
  length: ["cm", "in"],
  head_circumference: ["cm", "in"],
};

export function GrowthDetailsModal({
  visible,
  growth,
  onClose,
  onDelete,
  onEdit,
}: GrowthDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedNotes, setEditedNotes] = useState("");

  useEffect(() => {
    if (growth) {
      setEditedValue(growth.value.toString());
      setEditedUnit(growth.unit);
      setEditedDate(growth.date);
      setEditedNotes(growth.notes || "");
    }
    setIsEditing(false);
  }, [growth]);

  const handleSave = () => {
    if (onEdit && growth) {
      onEdit(growth.id, {
        value: parseFloat(editedValue),
        unit: editedUnit,
        date: editedDate,
        notes: editedNotes,
      });
      setIsEditing(false);
    }
  };

  const formatPercentile = (percentile: number | undefined) => {
    if (percentile === undefined) return "Not calculated";

    if (percentile >= 95) return `${percentile}th (High)`;
    if (percentile <= 5) return `${percentile}th (Low)`;
    return `${percentile}th (Normal)`;
  };

  if (!growth) return null;

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
              <Text style={styles.headerTitle}>
                {GROWTH_LABELS[growth.type] || "Growth"} Details
              </Text>
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
                  <Text style={styles.label}>Measurement</Text>
                  <View style={styles.measurementContainer}>
                    <Text style={styles.value}>{growth.value} {growth.unit}</Text>
                    {growth.percentile && (
                      <View style={styles.percentileBadge}>
                        <Text style={styles.percentileText}>
                          {formatPercentile(growth.percentile)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{growth.date}</Text>
                </View>

                {growth.percentile !== undefined && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Percentile</Text>
                    <View style={[styles.percentileBar, { width: `${growth.percentile}%` }]}>
                      <Text style={styles.percentileBarText}>{growth.percentile}%</Text>
                    </View>
                    <Text style={styles.percentileInfo}>
                      {growth.percentile >= 95
                        ? "Above average"
                        : growth.percentile <= 5
                        ? "Below average"
                        : "Normal range"}
                    </Text>
                  </View>
                )}

                {growth.notes && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.notes}>{growth.notes}</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.chipsContainer}>
                    {GROWTH_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          growth.type === type && styles.chipActive,
                        ]}
                        disabled
                      >
                        <Text
                          style={[
                            styles.chipText,
                            growth.type === type && styles.chipTextActive,
                          ]}
                        >
                          {GROWTH_LABELS[type]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Value</Text>
                  <TextInput
                    style={styles.input}
                    value={editedValue}
                    onChangeText={setEditedValue}
                    placeholder="Enter value"
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Unit</Text>
                  <View style={styles.chipsContainer}>
                    {(GROWTH_UNITS[growth.type] || []).map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.chip,
                          editedUnit === unit && styles.chipActive,
                        ]}
                        onPress={() => setEditedUnit(unit)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editedUnit === unit && styles.chipTextActive,
                          ]}
                        >
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput
                    style={styles.input}
                    value={editedDate}
                    onChangeText={setEditedDate}
                    placeholder="YYYY-MM-DD"
                  />
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
  measurementContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  percentileBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  percentileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  percentileBar: {
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    marginBottom: 8,
  },
  percentileBarText: {
    color: "#ffffff",
    fontSize: 10,
    textAlign: "center",
  },
  percentileInfo: {
    fontSize: 14,
    color: "#64748b",
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

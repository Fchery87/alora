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

const TYPE_COLORS: Record<string, string> = {
  weight: "#C9A227", // gold
  length: "#C17A5C", // clay
  head_circumference: "#6B7A6B", // moss
};

const GOLD = "#C9A227";
const SAGE = "#8B9A7D";
const CLAY = "#C17A5C";

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

  const getPercentileColor = (percentile: number | undefined) => {
    if (!percentile) return SAGE;
    if (percentile >= 95) return GOLD;
    if (percentile <= 5) return CLAY;
    return SAGE;
  };

  if (!growth) return null;

  const typeColor = TYPE_COLORS[growth.type] || GOLD;
  const percentileColor = getPercentileColor(growth.percentile);

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
                <Ionicons name="close-outline" size={24} color={typeColor} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {GROWTH_LABELS[growth.type] || "Growth"} Details
              </Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={24} color={SAGE} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color={typeColor} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {!isEditing ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Measurement</Text>
                  <View style={styles.measurementContainer}>
                    <Text style={[styles.value, { color: typeColor }]}>
                      {growth.value}{" "}
                      <Text style={styles.unit}>{growth.unit}</Text>
                    </Text>
                    {growth.percentile && (
                      <View
                        style={[
                          styles.percentileBadge,
                          { backgroundColor: `${percentileColor}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.percentileText,
                            { color: percentileColor },
                          ]}
                        >
                          {formatPercentile(growth.percentile)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.dateValue}>{growth.date}</Text>
                </View>

                {growth.percentile !== undefined && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Percentile</Text>
                    <View style={styles.percentileBarContainer}>
                      <View
                        style={[
                          styles.percentileBar,
                          {
                            width: `${growth.percentile}%`,
                            backgroundColor: percentileColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.percentileInfo}>
                      {growth.percentile >= 95
                        ? "Above average range"
                        : growth.percentile <= 5
                          ? "Below average range - consider discussing with pediatrician"
                          : "Normal growth range"}
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
                          growth.type === type && [
                            styles.chipActive,
                            {
                              backgroundColor: typeColor,
                              borderColor: typeColor,
                            },
                          ],
                          growth.type !== type && {
                            backgroundColor: "#ffffff",
                            borderColor: "rgba(139, 154, 125, 0.3)",
                          },
                        ]}
                        disabled
                      >
                        <Text
                          style={[
                            styles.chipText,
                            growth.type === type && styles.chipTextActive,
                            growth.type !== type && { color: "#6B6560" },
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
                    placeholderTextColor="#9B8B7A"
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
                          editedUnit === unit && [
                            styles.chipActive,
                            { backgroundColor: SAGE, borderColor: SAGE },
                          ],
                          editedUnit !== unit && {
                            backgroundColor: "rgba(139, 154, 125, 0.1)",
                            borderColor: "rgba(139, 154, 125, 0.3)",
                          },
                        ]}
                        onPress={() => setEditedUnit(unit)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editedUnit === unit && styles.chipTextActive,
                            editedUnit !== unit && { color: "#6B6560" },
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
                    placeholderTextColor="#9B8B7A"
                  />
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
  measurementContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
  unit: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B6560",
  },
  percentileBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  percentileText: {
    fontSize: 13,
    fontWeight: "600",
  },
  percentileBarContainer: {
    height: 10,
    backgroundColor: "rgba(139, 154, 125, 0.15)",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  percentileBar: {
    height: "100%",
    borderRadius: 5,
  },
  percentileInfo: {
    fontSize: 14,
    color: "#6B6560",
    lineHeight: 20,
  },
  dateValue: {
    fontSize: 16,
    color: "#2D2A26",
    fontWeight: "500",
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
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

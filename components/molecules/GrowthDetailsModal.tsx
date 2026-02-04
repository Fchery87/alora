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
  weight: COLORS.gold,
  length: COLORS.clay,
  head_circumference: COLORS.moss,
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

  const getPercentileColor = (percentile: number | undefined) => {
    if (!percentile) return COLORS.sage;
    if (percentile >= 95) return COLORS.gold;
    if (percentile <= 5) return COLORS.clay;
    return COLORS.sage;
  };

  if (!growth) return null;

  const typeColor = TYPE_COLORS[growth.type] || COLORS.gold;
  const percentileColor = getPercentileColor(growth.percentile);

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
                <Text style={styles.headerTitle}>
                  {GROWTH_LABELS[growth.type] || "Growth"} Details
                </Text>
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
                        <MotiView
                          from={{ width: "0%" }}
                          animate={{ width: `${growth.percentile}%` }}
                          transition={{ duration: ANIMATION.slow, delay: 200 }}
                          style={[
                            styles.percentileBar,
                            { backgroundColor: percentileColor },
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
                      {GROWTH_TYPES.map((type, index) => (
                        <MotiView
                          key={type}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
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
                                backgroundColor: BACKGROUND.card,
                                borderColor: `${COLORS.sage}40`,
                              },
                            ]}
                            disabled
                          >
                            <Text
                              style={[
                                styles.chipText,
                                growth.type === type && styles.chipTextActive,
                                growth.type !== type && {
                                  color: TEXT.secondary,
                                },
                              ]}
                            >
                              {GROWTH_LABELS[type]}
                            </Text>
                          </TouchableOpacity>
                        </MotiView>
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
                      placeholderTextColor={TEXT.tertiary}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.chipsContainer}>
                      {(GROWTH_UNITS[growth.type] || []).map((unit, index) => (
                        <MotiView
                          key={unit}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.chip,
                              editedUnit === unit && [
                                styles.chipActive,
                                {
                                  backgroundColor: COLORS.sage,
                                  borderColor: COLORS.sage,
                                },
                              ],
                              editedUnit !== unit && {
                                backgroundColor: `${COLORS.sage}15`,
                                borderColor: `${COLORS.sage}30`,
                              },
                            ]}
                            onPress={() => setEditedUnit(unit)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                editedUnit === unit && styles.chipTextActive,
                                editedUnit !== unit && {
                                  color: TEXT.secondary,
                                },
                              ]}
                            >
                              {unit}
                            </Text>
                          </TouchableOpacity>
                        </MotiView>
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
                      placeholderTextColor={TEXT.tertiary}
                    />
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
  measurementContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "CrimsonProBold",
  },
  unit: {
    fontSize: 18,
    fontWeight: "500",
    color: TEXT.secondary,
    fontFamily: "DMSans",
  },
  percentileBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  percentileText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "DMSansMedium",
  },
  percentileBarContainer: {
    height: 10,
    backgroundColor: `${COLORS.sage}20`,
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
    color: TEXT.secondary,
    lineHeight: 20,
    fontFamily: "DMSans",
  },
  dateValue: {
    fontSize: 16,
    color: TEXT.primary,
    fontWeight: "500",
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipActive: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans",
  },
  chipTextActive: {
    color: "#ffffff",
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

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

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  tags?: string[];
  isPrivate?: boolean;
  isWin?: boolean;
  createdAt: string | number;
}

interface JournalDetailsModalProps {
  visible: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: (id: string, updates: Partial<JournalEntry>) => void;
}

const JOURNAL_TAGS = [
  "Grateful",
  "Hard Day",
  "Funny Moment",
  "Tired",
  "Anxious",
  "Accomplished",
  "Loved",
];

export function JournalDetailsModal({
  visible,
  entry,
  onClose,
  onDelete,
  onEdit,
}: JournalDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedIsPrivate, setEditedIsPrivate] = useState(false);

  useEffect(() => {
    if (entry) {
      setEditedTitle(entry.title || "");
      setEditedContent(entry.content);
      setEditedTags(entry.tags || []);
      setEditedIsPrivate(entry.isPrivate || false);
    }
    setIsEditing(false);
  }, [entry]);

  const handleSave = () => {
    if (onEdit && entry) {
      onEdit(entry.id, {
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
        isPrivate: editedIsPrivate,
      });
      setIsEditing(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (editedTags.includes(tag)) {
      setEditedTags(editedTags.filter((t) => t !== tag));
    } else {
      setEditedTags([...editedTags, tag]);
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
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!entry) return null;

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
                <Text style={styles.headerTitle}>Journal Entry</Text>
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
                  {entry.title && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Title</Text>
                      <Text style={styles.title}>{entry.title}</Text>
                    </View>
                  )}

                  {entry.isWin && (
                    <MotiView
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 100 }}
                      style={styles.winBadge}
                    >
                      <GradientIcon
                        name="trophy"
                        size={14}
                        variant="accent"
                        animated={false}
                      />
                      <Text style={styles.winText}>Win!</Text>
                    </MotiView>
                  )}

                  {entry.isPrivate && (
                    <MotiView
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 150 }}
                      style={styles.privateBadge}
                    >
                      <Ionicons
                        name="lock-closed"
                        size={14}
                        color={TEXT.secondary}
                      />
                      <Text style={styles.privateText}>Private</Text>
                    </MotiView>
                  )}

                  <View style={styles.section}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>
                      {formatDateTime(entry.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Entry</Text>
                    <Text style={styles.entryContent}>{entry.content}</Text>
                  </View>

                  {entry.tags && entry.tags.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.label}>Tags</Text>
                      <View style={styles.tagsContainer}>
                        {entry.tags.map((tag, index) => (
                          <MotiView
                            key={tag}
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 50 }}
                            style={[
                              styles.tag,
                              {
                                backgroundColor: `${COLORS.sage}20`,
                                borderColor: `${COLORS.sage}40`,
                              },
                            ]}
                          >
                            <Text
                              style={[styles.tagText, { color: COLORS.moss }]}
                            >
                              {tag}
                            </Text>
                          </MotiView>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>Title (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={editedTitle}
                      onChangeText={setEditedTitle}
                      placeholder="Give your entry a title..."
                      placeholderTextColor={TEXT.tertiary}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Entry</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editedContent}
                      onChangeText={setEditedContent}
                      placeholder="Write about your day..."
                      placeholderTextColor={TEXT.tertiary}
                      multiline
                      numberOfLines={8}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Tags</Text>
                    <View style={styles.tagsContainer}>
                      {JOURNAL_TAGS.map((tag, index) => (
                        <MotiView
                          key={tag}
                          from={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 50 }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.tag,
                              editedTags.includes(tag) && [
                                styles.tagActive,
                                {
                                  backgroundColor: COLORS.sage,
                                  borderColor: COLORS.sage,
                                },
                              ],
                              !editedTags.includes(tag) && {
                                backgroundColor: `${COLORS.sage}15`,
                                borderColor: `${COLORS.sage}30`,
                              },
                            ]}
                            onPress={() => toggleTag(tag)}
                          >
                            <Text
                              style={[
                                styles.tagText,
                                editedTags.includes(tag) &&
                                  styles.tagTextActive,
                                !editedTags.includes(tag) && {
                                  color: COLORS.moss,
                                },
                              ]}
                            >
                              {tag}
                            </Text>
                          </TouchableOpacity>
                        </MotiView>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <View style={styles.switchContainer}>
                      <TouchableOpacity
                        style={[
                          styles.switch,
                          editedIsPrivate && { backgroundColor: COLORS.sage },
                        ]}
                        onPress={() => setEditedIsPrivate(!editedIsPrivate)}
                      >
                        {editedIsPrivate && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#ffffff"
                          />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.switchLabel}>Make Private</Text>
                    </View>
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
    maxHeight: "90%",
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT.primary,
    lineHeight: 28,
    fontFamily: "CrimsonProBold",
  },
  value: {
    fontSize: 15,
    color: TEXT.secondary,
    lineHeight: 22,
    fontFamily: "DMSans",
  },
  entryContent: {
    fontSize: 15,
    color: TEXT.primary,
    lineHeight: 24,
    fontFamily: "DMSans",
  },
  winBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${COLORS.gold}15`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  winText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A08020",
    fontFamily: "DMSansMedium",
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${TEXT.secondary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  privateText: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT.secondary,
    fontFamily: "DMSans",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  tagActive: {
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "DMSans",
  },
  tagTextActive: {
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
  textArea: {
    height: 140,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  switch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: `${TEXT.secondary}30`,
    justifyContent: "center",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 15,
    color: TEXT.primary,
    fontWeight: "500",
    fontFamily: "DMSans",
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

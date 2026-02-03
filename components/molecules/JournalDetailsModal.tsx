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

const CLAY = "#C17A5C";
const GOLD = "#C9A227";
const SAGE = "#8B9A7D";
const MOSS = "#6B7A6B";

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
                <Ionicons name="close-outline" size={24} color={CLAY} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Journal Entry</Text>
              {isEditing ? (
                <TouchableOpacity onPress={handleSave}>
                  <Ionicons name="checkmark-outline" size={24} color={SAGE} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={24} color={CLAY} />
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
                  <View style={styles.winBadge}>
                    <Ionicons name="trophy" size={16} color={GOLD} />
                    <Text style={styles.winText}>Win!</Text>
                  </View>
                )}

                {entry.isPrivate && (
                  <View style={styles.privateBadge}>
                    <Ionicons name="lock-closed" size={14} color="#6B6560" />
                    <Text style={styles.privateText}>Private</Text>
                  </View>
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
                      {entry.tags.map((tag) => (
                        <View
                          key={tag}
                          style={[
                            styles.tag,
                            {
                              backgroundColor: `${SAGE}20`,
                              borderColor: `${SAGE}40`,
                            },
                          ]}
                        >
                          <Text style={[styles.tagText, { color: MOSS }]}>
                            {tag}
                          </Text>
                        </View>
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
                    placeholderTextColor="#9B8B7A"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Entry</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    placeholder="Write about your day..."
                    placeholderTextColor="#9B8B7A"
                    multiline
                    numberOfLines={8}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {JOURNAL_TAGS.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tag,
                          editedTags.includes(tag) && [
                            styles.tagActive,
                            { backgroundColor: SAGE, borderColor: SAGE },
                          ],
                          !editedTags.includes(tag) && {
                            backgroundColor: "rgba(139, 154, 125, 0.1)",
                            borderColor: "rgba(139, 154, 125, 0.3)",
                          },
                        ]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            editedTags.includes(tag) && styles.tagTextActive,
                            !editedTags.includes(tag) && { color: MOSS },
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <View style={styles.switchContainer}>
                    <TouchableOpacity
                      style={[
                        styles.switch,
                        editedIsPrivate && { backgroundColor: SAGE },
                      ]}
                      onPress={() => setEditedIsPrivate(!editedIsPrivate)}
                    >
                      {editedIsPrivate && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
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
    maxHeight: "85%",
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
    color: "#2D2A26", // warm-dark
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B6560", // warm-gray
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2A26",
    lineHeight: 28,
  },
  value: {
    fontSize: 15,
    color: "#6B6560",
    lineHeight: 22,
  },
  entryContent: {
    fontSize: 15,
    color: "#2D2A26",
    lineHeight: 24,
  },
  winBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(201, 162, 39, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  winText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A08020",
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(107, 101, 96, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  privateText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B6560",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagActive: {
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tagTextActive: {
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
    backgroundColor: "rgba(107, 101, 96, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 15,
    color: "#2D2A26",
    fontWeight: "500",
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

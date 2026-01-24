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

const JOURNAL_TAGS = ["Grateful", "Hard Day", "Funny Moment", "Tired", "Anxious", "Accomplished", "Loved"];

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
                <Ionicons name="close-outline" size={24} color="#6366f1" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Journal Entry</Text>
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
                {entry.title && (
                  <View style={styles.section}>
                    <Text style={styles.label}>Title</Text>
                    <Text style={styles.title}>{entry.title}</Text>
                  </View>
                )}

                {entry.isWin && (
                  <View style={styles.winBadge}>
                    <Ionicons name="trophy" size={16} color="#f59e0b" />
                    <Text style={styles.winText}>Win!</Text>
                  </View>
                )}

                {entry.isPrivate && (
                  <View style={styles.privateBadge}>
                    <Ionicons name="lock-closed" size={14} color="#64748b" />
                    <Text style={styles.privateText}>Private</Text>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{formatDateTime(entry.createdAt)}</Text>
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
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
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
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Entry</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    placeholder="Write about your day..."
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
                          editedTags.includes(tag) && styles.tagActive,
                        ]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            editedTags.includes(tag) && styles.tagTextActive,
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
                      style={[styles.switch, editedIsPrivate && styles.switchActive]}
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
    maxHeight: "85%",
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 28,
  },
  value: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 20,
  },
  entryContent: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
  },
  winBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  winText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b45309",
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  privateText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tagActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
  },
  tagTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  switchActive: {
    backgroundColor: "#3b82f6",
  },
  switchLabel: {
    fontSize: 15,
    color: "#334155",
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

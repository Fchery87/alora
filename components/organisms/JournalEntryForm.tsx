import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useCreateJournal } from "@/hooks/queries/useJournal";

interface JournalEntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JournalEntryForm({
  onSuccess,
  onCancel,
}: JournalEntryFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGratitude, setIsGratitude] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const createJournal = useCreateJournal();

  const suggestedTags = [
    "grateful",
    "win",
    "struggle",
    "milestone",
    "funny",
    "tired",
    "happy",
    "overwhelmed",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createJournal.mutateAsync({
        title: title || undefined,
        content,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        isGratitude,
        isWin,
      });

      setTitle("");
      setContent("");
      setSelectedTags([]);
      setIsGratitude(false);
      setIsWin(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    }
  };

  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Quick Journal</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Title (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Give this entry a title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.wordCountRow}>
          <Text style={styles.label}>What's on your mind?</Text>
          <Text style={styles.charCount}>
            {wordCount} words, {charCount} characters
          </Text>
        </View>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your thoughts here..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Quick tags</Text>
        <View style={styles.tagsContainer}>
          {suggestedTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                selectedTags.includes(tag) && styles.tagActive,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextActive,
                ]}
              >
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.togglesContainer}>
          <TouchableOpacity
            style={[styles.toggle, isGratitude && styles.toggleActive]}
            onPress={() => setIsGratitude(!isGratitude)}
          >
            <Ionicons
              name="heart"
              size={20}
              color={isGratitude ? "#fff" : "#f472b6"}
            />
            <Text
              style={[
                styles.toggleText,
                isGratitude && styles.toggleTextActive,
              ]}
            >
              Gratitude
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggle, isWin && styles.toggleActive]}
            onPress={() => setIsWin(!isWin)}
          >
            <Ionicons
              name="trophy"
              size={20}
              color={isWin ? "#fff" : "#fbbf24"}
            />
            <Text style={[styles.toggleText, isWin && styles.toggleTextActive]}>
              Win
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!content.trim() || createJournal.isPending) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!content.trim() || createJournal.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createJournal.isPending ? "Saving..." : "Save Entry"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import { TextInput } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  wordCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#9ca3af",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    minHeight: 120,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tagActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6366f1",
    textTransform: "lowercase",
  },
  tagTextActive: {
    color: "#ffffff",
  },
  togglesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  toggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  toggleActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  toggleTextActive: {
    color: "#ffffff",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput as RNTextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useCreateJournal } from "@/hooks/queries/useJournal";
import {
  validateJournal,
  type JournalFormData,
  hasFieldError,
} from "@/lib/validation";
import { parseError, logError, getUserFriendlyMessage } from "@/lib/errors";
import { useToast } from "@/components/atoms/Toast";

import { TextInput } from "react-native";

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
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

  const validate = () => {
    const formData: Partial<JournalFormData> = {
      title,
      content,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      isGratitude,
      isWin,
    };

    const result = validateJournal(formData);
    const errors: Record<string, string> = {};

    result.errors.forEach((error) => {
      errors[error.field] = error.message;
    });

    setValidationErrors(errors);
    return result.isValid;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    setTouched({ content: true });

    if (!validate()) {
      toast.error("Validation Error", "Please fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

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
      setTouched({});
      setValidationErrors({});
      toast.success(
        "Journal Entry Saved",
        "Your journal entry has been saved successfully"
      );
      onSuccess?.();
    } catch (error) {
      const appError = parseError(error);
      logError(error, {
        context: "JournalEntryForm",
        contentLength: content.length,
      });

      toast.error("Failed to Save Entry", getUserFriendlyMessage(appError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = () => {
    const formData: Partial<JournalFormData> = { content };
    const result = validateJournal(formData);
    return result.isValid;
  };

  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Quick Journal</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Title (optional)</Text>
        <RNTextInput
          style={StyleSheet.flatten(
            [
              styles.input,
              touched.title && validationErrors.title ? styles.inputError : undefined,
            ].filter(Boolean)
          )}
          placeholder="Give this entry a title..."
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (touched.title) validate();
          }}
          onBlur={() => handleBlur("title")}
          placeholderTextColor="#9ca3af"
        />
        {touched.title && validationErrors.title && (
          <Text style={styles.errorText}>{validationErrors.title}</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.wordCountRow}>
          <Text style={styles.label}>What's on your mind?</Text>
          <Text style={styles.charCount}>
            {wordCount} words, {charCount} characters
          </Text>
        </View>
        <RNTextInput
          style={StyleSheet.flatten(
            [
              styles.input,
              styles.textArea,
              touched.content && validationErrors.content ? styles.inputError : undefined,
            ].filter(Boolean)
          )}
          placeholder="Write your thoughts here..."
          value={content}
          onChangeText={(text) => {
            setContent(text);
            if (touched.content) validate();
          }}
          onBlur={() => handleBlur("content")}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
        />
        {touched.content && validationErrors.content && (
          <Text style={styles.errorText}>{validationErrors.content}</Text>
        )}
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
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
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

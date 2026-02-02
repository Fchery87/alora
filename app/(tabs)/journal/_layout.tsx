import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function JournalScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Journal" showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.quickEntry}>
          <Text style={styles.title}>Quick Journal</Text>
          <Text style={styles.subtitle}>
            Capture your thoughts, gratitude, and milestones
          </Text>
          <TouchableOpacity
            style={styles.newEntryButton}
            onPress={() => router.push("/(tabs)/journal/new")}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.newEntryText}>New Entry</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promptsSection}>
          <Text style={styles.sectionTitle}>Writing Prompts</Text>
          <View style={styles.promptCard}>
            <Ionicons name="sparkles" size={20} color="#6366f1" />
            <Text style={styles.promptText}>What made you smile today?</Text>
          </View>
          <View style={styles.promptCard}>
            <Ionicons name="sparkles" size={20} color="#6366f1" />
            <Text style={styles.promptText}>
              What's one thing you're grateful for?
            </Text>
          </View>
          <View style={styles.promptCard}>
            <Ionicons name="sparkles" size={20} color="#6366f1" />
            <Text style={styles.promptText}>
              What was a challenge you overcame?
            </Text>
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No entries yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start writing to see your journal history
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  quickEntry: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  newEntryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  newEntryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  promptsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  promptText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  recentSection: {
    flex: 1,
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
});

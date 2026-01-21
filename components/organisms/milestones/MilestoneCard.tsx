import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FadeContainer } from "@/components/atoms/MotiContainers";
import { MILESTONE_CATEGORIES } from "@/lib/milestones";

interface MilestoneCardProps {
  milestone: {
    id: string;
    title: string;
    description?: string;
    category: string;
    date?: string;
    ageMonths?: number;
    isCelebrated: boolean;
    photoUrl?: string;
  };
  onCelebrate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MilestoneCard({
  milestone,
  onCelebrate,
  onDelete,
}: MilestoneCardProps) {
  const category =
    MILESTONE_CATEGORIES[
      milestone.category as keyof typeof MILESTONE_CATEGORIES
    ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <FadeContainer>
      <View style={[styles.card, milestone.isCelebrated && styles.celebrated]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: (category?.color || "#6366f1") + "20" },
          ]}
        >
          <Ionicons
            name={(category?.icon as keyof typeof Ionicons.glyphMap) || "star"}
            size={24}
            color={category?.color || "#6366f1"}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{milestone.title}</Text>
            {milestone.isCelebrated && (
              <View style={styles.celebratedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.celebratedText}>Celebrated</Text>
              </View>
            )}
          </View>

          {milestone.description && (
            <Text style={styles.description}>{milestone.description}</Text>
          )}

          <View style={styles.footer}>
            {milestone.ageMonths && (
              <Text style={styles.age}>{milestone.ageMonths} months</Text>
            )}
            {milestone.date && (
              <Text style={styles.date}>{formatDate(milestone.date)}</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {!milestone.isCelebrated && onCelebrate && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onCelebrate(milestone.id)}
            >
              <Ionicons name="gift-outline" size={20} color="#22c55e" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(milestone.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </FadeContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  celebrated: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#22c55e40",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  age: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
  celebratedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  celebratedText: {
    fontSize: 11,
    color: "#22c55e",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "column",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
});

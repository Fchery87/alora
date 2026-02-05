import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FadeContainer } from "@/components/atoms/MotiContainers";
import { MILESTONE_CATEGORIES } from "@/lib/milestones";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

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
            { backgroundColor: (category?.color || COLORS.terracotta) + "20" },
          ]}
        >
          <Ionicons
            name={(category?.icon as keyof typeof Ionicons.glyphMap) || "star"}
            size={24}
            color={category?.color || COLORS.terracotta}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{milestone.title}</Text>
            {milestone.isCelebrated && (
              <View style={styles.celebratedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.sage} />
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
              <Ionicons name="gift-outline" size={20} color={COLORS.sage} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(milestone.id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
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
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.sm,
  },
  celebrated: {
    backgroundColor: "rgba(47, 107, 91, 0.08)",
    borderColor: "rgba(47, 107, 91, 0.22)",
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
    ...TYPOGRAPHY.headings.h4,
    color: THEME_TEXT.primary,
  },
  description: {
    ...TYPOGRAPHY.body.small,
    color: THEME_TEXT.secondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  age: {
    fontSize: 12,
    color: THEME_TEXT.tertiary,
    fontFamily: "CareJournalUIMedium",
  },
  date: {
    fontSize: 12,
    color: THEME_TEXT.tertiary,
    fontFamily: "CareJournalUI",
  },
  celebratedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  celebratedText: {
    fontSize: 11,
    color: COLORS.sage,
    fontFamily: "CareJournalUIMedium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "column",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
});

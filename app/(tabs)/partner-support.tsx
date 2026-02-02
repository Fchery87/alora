import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { REFLECTION_QUESTIONS, getRandomPrompt } from "@/lib/partner-support";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useSelectedBabyId } from "@/stores/babyStore";
import { useFeeds } from "@/hooks/queries/useFeeds";
import {
  computePartnerNudges,
  shouldShowPartnerNudge,
} from "@/lib/partner-nudges";
import {
  usePartnerNudgeActions,
  usePartnerNudgeState,
} from "@/stores/partnerNudgeStore";

export default function PartnerSupportScreen() {
  const [reflection, setReflection] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(getRandomPrompt());
  const [showReflection, setShowReflection] = useState(false);

  const selectedBabyId = useSelectedBabyId();
  const feedsQuery = useFeeds(selectedBabyId ?? "");
  const { mutedUntilMs, lastShownAtMs } = usePartnerNudgeState();
  const { dismiss, muteForMs } = usePartnerNudgeActions();

  const now = new Date();
  const nudges = computePartnerNudges({
    now,
    feeds: (feedsQuery.data as any[])?.map((f) => ({
      startTime: f.startTime,
      createdById: f.createdById,
    })),
  });
  const activeNudge = nudges[0] ?? null;
  const showNudge =
    Boolean(selectedBabyId) &&
    Boolean(activeNudge) &&
    shouldShowPartnerNudge({
      nudgeId: activeNudge!.id,
      nowMs: Date.now(),
      mutedUntilMs,
      lastShownAtMs,
      cooldownMs: 12 * 60 * 60 * 1000,
    });

  const handleNewPrompt = () => {
    setCurrentPrompt(getRandomPrompt());
    setReflection("");
    setShowReflection(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "checkin":
        return "chatbubble-ellipses";
      case "appreciation":
        return "heart";
      case "support":
        return "people";
      case "reflection":
        return "sparkles";
      default:
        return "chatbubble";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "checkin":
        return "#3b82f6";
      case "appreciation":
        return "#ec4899";
      case "support":
        return "#22c55e";
      case "reflection":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Partner Support" showBackButton />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showNudge && activeNudge ? (
          <View style={styles.promptSection}>
            <Text style={styles.sectionTitle}>Nudge</Text>
            <View style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <View style={[styles.categoryBadge, styles.nudgeBadge]}>
                  <Ionicons name="people" size={16} color="#22c55e" />
                  <Text
                    style={[styles.categoryBadgeText, styles.nudgeBadgeText]}
                  >
                    Teamwork
                  </Text>
                </View>
              </View>

              <Text style={styles.promptMessage}>{activeNudge.message}</Text>

              <View style={styles.nudgeActionsRow}>
                <Pressable
                  style={[styles.newPromptButton, styles.nudgeActionButton]}
                  onPress={() => dismiss()}
                >
                  <Ionicons name="checkmark" size={18} color="#6366f1" />
                  <Text style={styles.newPromptText}>Got it</Text>
                </Pressable>
                <Pressable
                  style={[styles.newPromptButton, styles.nudgeActionButton]}
                  onPress={() => muteForMs(24 * 60 * 60 * 1000)}
                >
                  <Ionicons name="volume-mute" size={18} color="#6366f1" />
                  <Text style={styles.newPromptText}>Mute 24h</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.promptSection}>
          <Text style={styles.sectionTitle}>Today's Prompt</Text>

          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: `${getCategoryColor(currentPrompt.category)}20`,
                  },
                ]}
              >
                <Ionicons
                  name={getCategoryIcon(currentPrompt.category) as any}
                  size={16}
                  color={getCategoryColor(currentPrompt.category)}
                />
                <Text
                  style={[
                    styles.categoryBadgeText,
                    { color: getCategoryColor(currentPrompt.category) },
                  ]}
                >
                  {currentPrompt.category.charAt(0).toUpperCase() +
                    currentPrompt.category.slice(1)}
                </Text>
              </View>
              <Pressable
                style={styles.newPromptButton}
                onPress={handleNewPrompt}
              >
                <Ionicons name="refresh" size={18} color="#6366f1" />
                <Text style={styles.newPromptText}>New</Text>
              </Pressable>
            </View>

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ stiffness: 200, damping: 20 }}
            >
              <Text style={styles.promptMessage}>{currentPrompt.message}</Text>
            </MotiView>

            <Pressable
              style={styles.discussButton}
              onPress={() => setShowReflection(!showReflection)}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              <Text style={styles.discussButtonText}>Discuss Together</Text>
            </Pressable>
          </View>
        </View>

        {showReflection && (
          <View style={styles.reflectionSection}>
            <Text style={styles.sectionTitle}>Reflection</Text>

            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionLabel}>
                Share your thoughts together, then save a note:
              </Text>

              <TextInput
                style={styles.reflectionInput}
                placeholder="Write your thoughts here..."
                value={reflection}
                onChangeText={setReflection}
                multiline
                numberOfLines={6}
              />

              <Pressable
                style={[
                  styles.saveButton,
                  !reflection && styles.saveButtonDisabled,
                ]}
                disabled={!reflection}
              >
                <Ionicons name="save" size={18} color="#fff" />
                <Text style={styles.saveButtonText}>Save Reflection</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>Conversation Starters</Text>

          <View style={styles.questionsList}>
            {REFLECTION_QUESTIONS.map((question, index) => (
              <Pressable key={index} style={styles.questionCard}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.questionText}>{question}</Text>
                <Ionicons name="arrow-forward" size={18} color="#6366f1" />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips for Good Conversations</Text>

          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="time" size={20} color="#6366f1" />
              <Text style={styles.tipText}>
                Choose a calm moment when both are relaxed
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="ear" size={20} color="#6366f1" />
              <Text style={styles.tipText}>Listen more than you speak</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="heart" size={20} color="#6366f1" />
              <Text style={styles.tipText}>
                Be kind and patient with each other
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="happy" size={20} color="#6366f1" />
              <Text style={styles.tipText}>
                Celebrate your wins, no matter how small
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  promptSection: {
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  nudgeBadge: {
    backgroundColor: "#22c55e20",
  },
  nudgeBadgeText: {
    color: "#22c55e",
  },
  nudgeActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  nudgeActionButton: {
    flex: 1,
    justifyContent: "center",
  },
  newPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
  },
  newPromptText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6366f1",
  },
  promptMessage: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0f172a",
    lineHeight: 26,
    marginBottom: 20,
  },
  discussButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  discussButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reflectionSection: {
    marginBottom: 24,
  },
  reflectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  reflectionLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  reflectionInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#0f172a",
    textAlignVertical: "top",
    minHeight: 120,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  questionsSection: {
    marginBottom: 24,
  },
  questionsList: {
    gap: 8,
  },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
});

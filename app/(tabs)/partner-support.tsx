import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { REFLECTION_QUESTIONS, getRandomPrompt } from "@/lib/partner-support";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useSelectedBabyId } from "@/stores/babyStore";
import {
  computePartnerNudges,
  shouldShowPartnerNudge,
} from "@/lib/partner-nudges";
import {
  usePartnerNudgeActions,
  usePartnerNudgeState,
} from "@/stores/partnerNudgeStore";
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PartnerSupportScreen() {
  const [reflection, setReflection] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(() => getRandomPrompt());
  const [showReflection, setShowReflection] = useState(false);

  const selectedBabyId = useSelectedBabyId();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const feeds =
    useQuery(
      (api as any).feeds.listFeeds,
      isAuthLoaded && isSignedIn && selectedBabyId
        ? { babyId: selectedBabyId as any, limit: 50 }
        : "skip"
    ) ?? [];
  const { mutedUntilMs, lastShownAtMs } = usePartnerNudgeState();
  const { dismiss, muteForMs } = usePartnerNudgeActions();

  const feedSummaries = useMemo(() => {
    return (feeds as any[]).map((f) => ({
      startTime: f.startTime as number,
      createdById: f.createdById as string,
    }));
  }, [feeds]);

  const activeNudge = useMemo(() => {
    const nudges = computePartnerNudges({ now: new Date(), feeds: feedSummaries });
    return nudges[0] ?? null;
  }, [feedSummaries]);

  const showNudge = useMemo(() => {
    if (!selectedBabyId) return false;
    if (!activeNudge) return false;
    return shouldShowPartnerNudge({
      nudgeId: activeNudge.id,
      nowMs: Date.now(),
      mutedUntilMs,
      lastShownAtMs,
      cooldownMs: 12 * 60 * 60 * 1000,
    });
  }, [activeNudge, lastShownAtMs, mutedUntilMs, selectedBabyId]);

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
        return COLORS.sage;
      case "appreciation":
        return COLORS.clay;
      case "support":
        return COLORS.terracotta;
      case "reflection":
        return COLORS.gold;
      default:
        return COLORS.stone;
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
                  <Ionicons name="people" size={16} color={COLORS.sage} />
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
                  <Ionicons name="checkmark" size={18} color={COLORS.sage} />
                  <Text style={styles.newPromptText}>Got it</Text>
                </Pressable>
                <Pressable
                  style={[styles.newPromptButton, styles.nudgeActionButton]}
                  onPress={() => muteForMs(24 * 60 * 60 * 1000)}
                >
                  <Ionicons
                    name="volume-mute"
                    size={18}
                    color={COLORS.terracotta}
                  />
                  <Text
                    style={[styles.newPromptText, { color: COLORS.terracotta }]}
                  >
                    Mute 24h
                  </Text>
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
                <Ionicons name="refresh" size={18} color={COLORS.terracotta} />
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
                placeholderTextColor={TEXT.tertiary}
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
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={COLORS.terracotta}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips for Good Conversations</Text>

          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="time" size={20} color={COLORS.terracotta} />
              <Text style={styles.tipText}>
                Choose a calm moment when both are relaxed
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="ear" size={20} color={COLORS.sage} />
              <Text style={styles.tipText}>Listen more than you speak</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="heart" size={20} color={COLORS.clay} />
              <Text style={styles.tipText}>
                Be kind and patient with each other
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="happy" size={20} color={COLORS.gold} />
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
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSansMedium",
    color: TEXT.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  promptSection: {
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 20,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: GLASS.light.border,
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
    fontFamily: "DMSansMedium",
  },
  nudgeBadge: {
    backgroundColor: `${COLORS.sage}20`,
  },
  nudgeBadgeText: {
    color: COLORS.sage,
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
    backgroundColor: `${COLORS.terracotta}15`,
    borderRadius: 16,
  },
  newPromptText: {
    fontSize: 13,
    fontFamily: "DMSansMedium",
    color: COLORS.terracotta,
  },
  promptMessage: {
    fontSize: 18,
    fontFamily: "CrimsonProMedium",
    color: TEXT.primary,
    lineHeight: 26,
    marginBottom: 20,
  },
  discussButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.terracotta,
    padding: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  discussButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSansMedium",
  },
  reflectionSection: {
    marginBottom: 24,
  },
  reflectionCard: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  reflectionLabel: {
    fontSize: 14,
    fontFamily: "DMSans",
    color: TEXT.secondary,
    marginBottom: 16,
  },
  reflectionInput: {
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: 16,
    fontFamily: "DMSans",
    color: TEXT.primary,
    textAlignVertical: "top",
    minHeight: 120,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.sage,
    padding: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: 16,
    ...SHADOWS.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSansMedium",
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
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.terracotta}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumberText: {
    fontSize: 14,
    fontFamily: "DMSansMedium",
    color: COLORS.terracotta,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans",
    color: TEXT.primary,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsList: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans",
    color: TEXT.secondary,
    lineHeight: 22,
  },
});

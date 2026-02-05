import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MilestoneTracker } from "@/components/organisms/milestones/MilestoneTracker";
import { MilestoneCard } from "@/components/organisms/milestones/MilestoneCard";
import { MilestoneCelebration } from "@/components/organisms/milestones/MilestoneCelebration";
import { FadeContainer } from "@/components/atoms/MotiContainers";
import {
  useListMilestones,
  useDeleteMilestone,
  useCelebrateMilestone,
} from "@/hooks/queries/useMilestones";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";
import { Header } from "@/components/layout/Header";
import { Text } from "@/components/ui/Text";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT } from "@/lib/theme";

export default function MilestonesScreen() {
  const [activeTab, setActiveTab] = useState<"log" | "timeline">("timeline");
  const [celebratingMilestone, setCelebratingMilestone] = useState<
    string | null
  >(null);
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  const { data: milestones, isLoading } = useListMilestones(
    selectedBabyId || "skip"
  );
  const deleteMilestone = useDeleteMilestone() as (args: {
    id: string;
  }) => void;
  const celebrateMilestone = useCelebrateMilestone() as (args: {
    id: string;
  }) => void;

  const handleCelebrate = async (id: string) => {
    const milestone = milestones?.find((m) => m.id === id);
    if (milestone) {
      setCelebratingMilestone(milestone.title);
      celebrateMilestone({ id });
    }
  };

  const handleDelete = async (id: string) => {
    deleteMilestone({ id });
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Milestones"
        showBackButton
        rightAction={{
          icon: "people-outline",
          onPress: () => setShowBabySelector(true),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.tabContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentItem,
              activeTab === "timeline" && styles.segmentItemActive,
            ]}
            onPress={() => setActiveTab("timeline")}
          >
            <Text
              variant="body"
              style={[styles.segmentText, activeTab === "timeline" && styles.segmentTextActive]}
            >
              Timeline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentItem,
              activeTab === "log" && styles.segmentItemActive,
            ]}
            onPress={() => setActiveTab("log")}
          >
            <Text
              variant="body"
              style={[styles.segmentText, activeTab === "log" && styles.segmentTextActive]}
            >
              Log New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "timeline" ? (
        <FadeContainer>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading milestones...</Text>
          ) : milestones && milestones.length > 0 ? (
            <View style={styles.timeline}>
              {milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onCelebrate={handleCelebrate}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No milestones yet</Text>
              <Text style={styles.emptyText}>
                Start tracking your baby's developmental milestones!
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setActiveTab("log")}
              >
                <Text style={styles.emptyButtonText}>Add First Milestone</Text>
              </TouchableOpacity>
            </View>
          )}
        </FadeContainer>
      ) : (
        <FadeContainer>
          {selectedBabyId ? (
            <MilestoneTracker babyId={selectedBabyId} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No baby selected</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowBabySelector(true)}
              >
                <Text style={styles.emptyButtonText}>Select Baby</Text>
              </TouchableOpacity>
            </View>
          )}
        </FadeContainer>
      )}

      <MilestoneCelebration
        visible={!!celebratingMilestone}
        milestoneTitle={celebratingMilestone || ""}
        onClose={() => setCelebratingMilestone(null)}
      />

      <BabySelectorModal
        visible={showBabySelector}
        onClose={() => setShowBabySelector(false)}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContainer: {
    marginBottom: 24,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentItemActive: {
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.sm,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: "CareJournalUIMedium",
    color: THEME_TEXT.secondary,
  },
  segmentTextActive: {
    color: THEME_TEXT.primary,
    fontFamily: "CareJournalUISemiBold",
  },
  timeline: {
    gap: 12,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 32,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    maxWidth: 260,
  },
  emptyButton: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  emptyButtonText: {
    color: THEME_TEXT.primaryInverse,
    fontSize: 15,
    fontFamily: "CareJournalUISemiBold",
  },
  babyNotSelected: {
    alignItems: "center",
    paddingVertical: 48,
  },
});

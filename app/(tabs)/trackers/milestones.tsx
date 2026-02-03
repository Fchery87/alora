import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

// Celestial Nurture Design System Colors
const COLORS = {
  background: "#FAF7F2",
  primary: "#D4A574", // Terracotta
  secondary: "#8B9A7D", // Sage
  accent: "#C9A227", // Gold
  textPrimary: "#2D2A26",
  textSecondary: "#6B6560",
};

export default function MilestonesScreen() {
  const router = useRouter();
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Milestones</Text>
      </View>

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
              style={[
                styles.segmentText,
                activeTab === "timeline" && styles.segmentTextActive,
              ]}
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
              style={[
                styles.segmentText,
                activeTab === "log" && styles.segmentTextActive,
              ]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: "CrimsonPro-SemiBold",
    color: COLORS.textPrimary,
  },
  tabContainer: {
    marginBottom: 24,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(139, 154, 125, 0.2)",
    borderRadius: 14,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
    fontFamily: "DMSans-SemiBold",
  },
  timeline: {
    gap: 12,
  },
  loadingText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 32,
    fontFamily: "DMSans-Regular",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: "CrimsonPro-SemiBold",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    fontFamily: "DMSans-Regular",
    maxWidth: 260,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSans-SemiBold",
  },
  babyNotSelected: {
    alignItems: "center",
    paddingVertical: 48,
  },
});

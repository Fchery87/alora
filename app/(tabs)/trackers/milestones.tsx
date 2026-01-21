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

export default function MilestonesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"log" | "timeline">("timeline");
  const [celebratingMilestone, setCelebratingMilestone] = useState<
    string | null
  >(null);

  const { data: milestones, isLoading } = useListMilestones("demo-baby-id");
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
          <MilestoneTracker babyId="demo-baby-id" />
        </FadeContainer>
      )}

      <MilestoneCelebration
        visible={!!celebratingMilestone}
        milestoneTitle={celebratingMilestone || ""}
        onClose={() => setCelebratingMilestone(null)}
      />
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
  },
  tabContainer: {
    marginBottom: 24,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentItemActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  segmentTextActive: {
    color: "#0f172a",
  },
  timeline: {
    gap: 12,
  },
  loadingText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 32,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

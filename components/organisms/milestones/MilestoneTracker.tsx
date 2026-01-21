import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  useCreateMilestone,
  useCelebrateMilestone,
} from "@/hooks/queries/useMilestones";
import { PREDEFINED_MILESTONES, MILESTONE_CATEGORIES } from "@/lib/milestones";

interface MilestoneTrackerProps {
  babyId: string;
  onSuccess?: () => void;
}

type CategoryType = "motor" | "cognitive" | "language" | "social" | "all";

export function MilestoneTracker({ babyId, onSuccess }: MilestoneTrackerProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customCategory, setCustomCategory] = useState<
    "motor" | "cognitive" | "language" | "social" | "custom"
  >("custom");
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const createMilestoneMutation = useCreateMilestone();
  const createMilestone = createMilestoneMutation as unknown as (
    args: any
  ) => void;
  const celebrateMilestoneMutation = useCelebrateMilestone();
  const celebrateMilestone = celebrateMilestoneMutation as unknown as (args: {
    id: string;
  }) => void;

  const handleCreateCustom = async () => {
    try {
      createMilestone({
        babyId: babyId as any,
        title: customTitle,
        description: customDescription || undefined,
        category: customCategory,
        date: customDate,
        isCustom: true,
      });
      setCustomTitle("");
      setCustomDescription("");
      setShowCustomForm(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create milestone:", error);
    }
  };

  const handleAddPredefined = async (
    milestone: (typeof PREDEFINED_MILESTONES)[0]
  ) => {
    try {
      createMilestone({
        babyId: babyId as any,
        title: milestone.title,
        description: milestone.description,
        category: milestone.category,
        isCustom: false,
        ageMonths: milestone.ageMonths,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add milestone:", error);
    }
  };

  const handleCelebrate = async (id: string) => {
    try {
      celebrateMilestone({ id });
    } catch (error) {
      console.error("Failed to celebrate milestone:", error);
    }
  };

  const categories: { value: CategoryType; label: string; icon: string }[] = [
    { value: "all", label: "All", icon: "apps-outline" },
    { value: "motor", label: "Motor", icon: "body-outline" },
    { value: "cognitive", label: "Cognitive", icon: "bulb-outline" },
    { value: "language", label: "Language", icon: "chatbubbles-outline" },
    { value: "social", label: "Social", icon: "people-outline" },
  ];

  const filteredPredefined = PREDEFINED_MILESTONES.filter(
    (m) => selectedCategory === "all" || m.category === selectedCategory
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Milestone</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowPredefined(true)}
        >
          <Ionicons name="star-outline" size={24} color="#fff" />
          <Text style={styles.mainButtonText}>Add Predefined</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.secondaryButton]}
          onPress={() => setShowCustomForm(true)}
        >
          <Ionicons name="create-outline" size={24} color="#6366f1" />
          <Text style={[styles.mainButtonText, styles.secondaryButtonText]}>
            Custom Milestone
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPredefined} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Predefined Milestone</Text>
              <TouchableOpacity onPress={() => setShowPredefined(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={styles.categoryRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.value &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.value)}
                >
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={selectedCategory === cat.value ? "#fff" : "#6366f1"}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === cat.value &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={styles.milestoneList}>
              {filteredPredefined.map((milestone, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.milestoneItem}
                  onPress={() => handleAddPredefined(milestone)}
                >
                  <View
                    style={[
                      styles.milestoneIcon,
                      {
                        backgroundColor:
                          MILESTONE_CATEGORIES[milestone.category].color + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        MILESTONE_CATEGORIES[milestone.category]
                          .icon as keyof typeof Ionicons.glyphMap
                      }
                      size={20}
                      color={MILESTONE_CATEGORIES[milestone.category].color}
                    />
                  </View>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestoneDesc}>
                      {milestone.description}
                    </Text>
                    <Text style={styles.milestoneAge}>
                      ~{milestone.ageMonths} months
                    </Text>
                  </View>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#6366f1"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showCustomForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Custom Milestone</Text>
              <TouchableOpacity onPress={() => setShowCustomForm(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContent}>
              <View style={styles.section}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter milestone title"
                  value={customTitle}
                  onChangeText={setCustomTitle}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Add a description..."
                  value={customDescription}
                  onChangeText={setCustomDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                  {Object.entries(MILESTONE_CATEGORIES).map(([key, cat]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categoryCard,
                        customCategory === key && styles.categoryCardActive,
                        { borderColor: cat.color },
                      ]}
                      onPress={() =>
                        setCustomCategory(key as typeof customCategory)
                      }
                    >
                      <Ionicons
                        name={cat.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={customCategory === key ? "#fff" : cat.color}
                      />
                      <Text
                        style={[
                          styles.categoryCardText,
                          customCategory === key &&
                            styles.categoryCardTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={customDate}
                  onChangeText={setCustomDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !customTitle && styles.submitButtonDisabled,
                ]}
                onPress={handleCreateCustom}
                disabled={!customTitle}
              >
                <Text style={styles.submitButtonText}>Create Milestone</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  mainButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    gap: 8,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  secondaryButtonText: {
    color: "#6366f1",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  categoryRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    gap: 4,
  },
  categoryButtonActive: {
    backgroundColor: "#6366f1",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6366f1",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  milestoneList: {
    paddingHorizontal: 16,
    maxHeight: 400,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 8,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  milestoneDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  milestoneAge: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  formContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  categoryCardActive: {
    backgroundColor: "#6366f1",
  },
  categoryCardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  categoryCardTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

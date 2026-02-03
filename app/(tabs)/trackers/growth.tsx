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
import { GrowthTracker } from "@/components/organisms/growth/GrowthTracker";
import { FadeContainer } from "@/components/atoms/MotiContainers";
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
  clay: "#B8956A",
  moss: "#7A8B6E",
};

export default function GrowthScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"log" | "history">("log");
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Growth Tracking</Text>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.segmentedControl}>
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
              Log Measurement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentItem,
              activeTab === "history" && styles.segmentItemActive,
            ]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "history" && styles.segmentTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "log" ? (
        <FadeContainer>
          {selectedBabyId ? (
            <GrowthTracker babyId={selectedBabyId} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="person-outline" size={64} color="#d1d5db" />
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
      ) : (
        <FadeContainer>
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Growth Chart</Text>
            <Text style={styles.chartPlaceholder}>
              Growth chart visualization will appear here with your baby's
              measurements.
            </Text>
          </View>
        </FadeContainer>
      )}

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
  chartSection: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "CrimsonPro-SemiBold",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartPlaceholder: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "CrimsonPro-SemiBold",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
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
});

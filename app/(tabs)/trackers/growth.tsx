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
import { GrowthChart } from "@/components/organisms/GrowthChart";
import { FadeContainer } from "@/components/atoms/MotiContainers";

export default function GrowthScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"log" | "history">("log");

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
          <GrowthTracker babyId="demo-baby-id" />
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
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  chartPlaceholder: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
  },
});

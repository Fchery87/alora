import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { GrowthTracker } from "@/components/organisms/growth/GrowthTracker";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { GradientButton } from "@/components/atoms/GradientButton";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";
import { Text } from "@/components/ui/Text";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT } from "@/lib/theme";

export default function GrowthScreen() {
  const [activeTab, setActiveTab] = useState<"log" | "history">("log");
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={styles.screen}>
      <Header
        title="Growth"
        showBackButton
        rightAction={{
          icon: "people-outline",
          onPress: () => setShowBabySelector(true),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Navigation */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 150, dampingRatio: 0.8, stiffness: 150 }}
          style={styles.tabContainer}
        >
          <View style={styles.segmentedControl}>
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
                variant="body"
                style={[
                  styles.segmentText,
                  activeTab === "history" && styles.segmentTextActive,
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Content */}
        {activeTab === "log" ? (
          <MotiView
            key="log"
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 20 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            {selectedBabyId ? (
              <GlassCard variant="accent" size="lg" delay={200}>
                <View style={styles.cardHeader}>
                  <GradientIcon
                    name="analytics"
                    size={28}
                    variant="accent"
                    delay={300}
                  />
                  <Text variant="h3" style={styles.cardTitle}>
                    Record growth
                  </Text>
                </View>
                <GrowthTracker babyId={selectedBabyId} />
              </GlassCard>
            ) : (
              <GlassCard variant="default" size="lg" delay={200}>
                <View style={styles.emptyState}>
                  <GradientIcon
                    name="person-outline"
                    size={32}
                    variant="accent"
                    delay={300}
                  />
                  <Text variant="h3" style={styles.emptyStateTitle}>
                    No baby selected
                  </Text>
                  <Text variant="body" color="secondary" style={styles.emptyStateText}>
                    Please select a baby to start tracking growth measurements
                  </Text>
                  <GradientButton
                    onPress={() => setShowBabySelector(true)}
                    variant="accent"
                    style={styles.emptyButton}
                  >
                    Select Baby
                  </GradientButton>
                </View>
              </GlassCard>
            )}
          </MotiView>
        ) : (
          <MotiView
            key="history"
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -20 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <GlassCard variant="default" size="lg" delay={200}>
              <View style={styles.cardHeader}>
                <GradientIcon
                  name="trending-up"
                  size={28}
                  variant="secondary"
                  delay={300}
                />
                <Text variant="h3" style={styles.cardTitle}>
                  Growth chart
                </Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Ionicons
                  name="bar-chart-outline"
                  size={64}
                  color={COLORS.terracotta}
                  style={{ opacity: 0.5 }}
                />
                <Text variant="h3" style={styles.placeholderTitle}>
                  Coming soon
                </Text>
                <Text variant="body" color="secondary" style={styles.placeholderText}>
                  Growth chart visualization will appear here with your baby's
                  measurements over time.
                </Text>
              </View>
            </GlassCard>
          </MotiView>
        )}
      </ScrollView>

      <BabySelectorModal
        visible={showBabySelector}
        onClose={() => setShowBabySelector(false)}
      />
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
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContainer: {
    marginBottom: 20,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    color: THEME_TEXT.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyStateTitle: {
    color: THEME_TEXT.primary,
    marginTop: 8,
  },
  emptyStateText: {
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  emptyButton: {
    marginTop: 8,
  },
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  placeholderTitle: {
    color: THEME_TEXT.primary,
    marginTop: 8,
  },
  placeholderText: {
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

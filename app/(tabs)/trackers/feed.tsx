import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MotiView } from "moti";
import { FeedForm } from "@/components/organisms";
import { ModernHeader } from "@/components/atoms/ModernHeader";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";
import { COLORS, TEXT, GRADIENTS } from "@/lib/theme";

export default function FeedTrackerScreen() {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={styles.screen}>
      <ModernHeader
        title="Feed Tracker"
        subtitle="Log your baby's feeding sessions"
        showBackButton
        backgroundColor="glass"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {selectedBabyId ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <GlassCard variant="warm" size="lg" delay={100}>
              <View style={styles.cardHeader}>
                <GradientIcon
                  name="restaurant"
                  size={28}
                  variant="primary"
                  delay={200}
                />
                <Text style={styles.cardTitle}>Log Feeding</Text>
              </View>
              <FeedForm babyId={selectedBabyId} />
            </GlassCard>
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <GlassCard variant="default" size="lg" delay={100}>
              <View style={styles.emptyState}>
                <GradientIcon
                  name="person-outline"
                  size={32}
                  variant="secondary"
                  delay={200}
                />
                <Text style={styles.emptyStateTitle}>No Baby Selected</Text>
                <Text style={styles.emptyStateText}>
                  Please select a baby to start tracking feedings
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
    backgroundColor: COLORS.cream,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "CrimsonPro-SemiBold",
    color: TEXT.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontFamily: "CrimsonPro-SemiBold",
    color: TEXT.primary,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: TEXT.secondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

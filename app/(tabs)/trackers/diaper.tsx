import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientIcon } from "@/components/atoms/GradientIcon";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";
import { useSelectedBabyId } from "@/stores/babyStore";
import { BabySelectorModal } from "@/components/organisms";
import { Text } from "@/components/ui/Text";
import { BACKGROUND, TEXT as THEME_TEXT } from "@/lib/theme";

export default function DiaperTrackerScreen() {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const selectedBabyId = useSelectedBabyId();

  return (
    <View style={styles.screen}>
      <Header
        title="Diaper"
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
        {selectedBabyId ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, dampingRatio: 0.8, stiffness: 150 }}
          >
            <GlassCard variant="secondary" size="lg" delay={100}>
              <View style={styles.cardHeader}>
                <GradientIcon
                  name="water"
                  size={28}
                  variant="secondary"
                  delay={200}
                />
                <Text variant="h3" style={styles.cardTitle}>
                  Log diaper change
                </Text>
              </View>
              <DiaperTracker babyId={selectedBabyId} />
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
                <Text variant="h3" style={styles.emptyStateTitle}>
                  No baby selected
                </Text>
                <Text variant="body" color="secondary" style={styles.emptyStateText}>
                  Please select a baby to start tracking diaper changes
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
  },
});

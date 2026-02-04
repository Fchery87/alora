import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { RADIUS, COLORS, TEXT } from "@/lib/theme";

interface MoodSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  emojiLabels?: Record<number, string>;
  label?: string;
  showValue?: boolean;
  delay?: number;
}

const defaultEmojiLabels: Record<number, string> = {
  1: "😢",
  2: "😟",
  3: "😕",
  4: "😐",
  5: "🙂",
  6: "😊",
  7: "😄",
  8: "😃",
  9: "🤗",
  10: "🥰",
};

export function MoodSlider({
  value,
  onValueChange,
  min = 1,
  max = 10,
  emojiLabels = defaultEmojiLabels,
  label,
  showValue = true,
  delay = 0,
}: MoodSliderProps) {
  const handlePress = (newValue: number) => {
    if (newValue !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(newValue);
    }
  };

  const renderEmoji = (num: number) => {
    const emoji = emojiLabels[num] || "";
    const isSelected = value === num;

    return (
      <TouchableOpacity
        key={num}
        onPress={() => handlePress(num)}
        activeOpacity={0.7}
        style={styles.emojiContainer}
      >
        <MotiView
          animate={{
            scale: isSelected ? 1.2 : 1,
            opacity: isSelected ? 1 : value > 0 && !isSelected ? 0.4 : 0.7,
          }}
          transition={{
            type: "spring",
            dampingRatio: 0.6,
            stiffness: 200,
          }}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </MotiView>

        {isSelected && (
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              dampingRatio: 0.5,
              stiffness: 300,
            }}
            style={styles.selectedIndicator}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.indicatorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </MotiView>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay,
        dampingRatio: 0.8,
        stiffness: 150,
      }}
      style={styles.container}
    >
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.sliderContainer}>
        <View style={styles.emojisRow}>
          {Array.from({ length: max - min + 1 }, (_, i) =>
            renderEmoji(min + i)
          )}
        </View>

        {showValue && (
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>{value}</Text>
            <Text style={styles.valueText}>
              {value <= 3
                ? "Having a hard time"
                : value <= 6
                  ? "Doing okay"
                  : value <= 8
                    ? "Feeling good"
                    : "Great!"}
            </Text>
          </View>
        )}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontFamily: "OutfitSemiBold",
    fontSize: 16,
    color: TEXT.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  sliderContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
  },
  emojisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  emojiContainer: {
    alignItems: "center",
    position: "relative",
  },
  emoji: {
    fontSize: 28,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  indicatorGradient: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  valueLabel: {
    fontFamily: "OutfitBold",
    fontSize: 24,
    color: COLORS.primary,
    minWidth: 28,
    textAlign: "center",
  },
  valueText: {
    fontFamily: "DMSans",
    fontSize: 14,
    color: TEXT.secondary,
  },
});

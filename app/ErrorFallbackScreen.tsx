import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

export default function ErrorFallbackScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.errorCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={52} color={COLORS.danger} />
        </View>

        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          An unexpected error occurred. Please try again.
        </Text>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.resetButton,
            pressed ? styles.resetButtonPressed : null,
          ]}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home" size={18} color={THEME_TEXT.primaryInverse} />
          <Text style={styles.resetButtonText}>Go to Home</Text>
        </Pressable>

        <Text style={styles.hint}>
          If the problem persists, restart the app
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorCard: {
    backgroundColor: BACKGROUND.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.md,
    width: "100%",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.headings.h2,
    color: THEME_TEXT.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    ...TYPOGRAPHY.body.regular,
    color: THEME_TEXT.secondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
    ...SHADOWS.sm,
    marginBottom: 16,
  },
  resetButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: THEME_TEXT.primaryInverse,
  },
  hint: {
    ...TYPOGRAPHY.body.small,
    color: THEME_TEXT.tertiary,
    textAlign: "center",
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ErrorFallbackScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.errorCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
        </View>

        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          An unexpected error occurred. Please try again.
        </Text>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => router.replace("/")}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={20} color="#ffffff" />
          <Text style={styles.resetButtonText}>Go to Home</Text>
        </TouchableOpacity>

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
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    width: "100%",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  hint: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});

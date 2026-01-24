import { Text, View, Pressable } from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";

export default function OnboardingScreen() {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 600 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16, textAlign: "center" }}>
        Welcome to Alora
      </Text>
      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 48, color: "#666" }}>
        Your parenting companion
      </Text>
      
      <Pressable
        onPress={() => router.push("/(auth)/login")}
        style={{
          backgroundColor: "#6366f1",
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Get Started
        </Text>
      </Pressable>
    </MotiView>
  );
}

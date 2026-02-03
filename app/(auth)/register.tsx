import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { cssInterop } from "react-native-css-interop";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

cssInterop(MotiView, { className: "style" });

// Celestial Nurture Design System Colors
const COLORS = {
  background: "#FAF7F2",
  primary: "#D4A574", // Terracotta
  secondary: "#8B9A7D", // Sage
  accent: "#C9A227", // Gold
  textPrimary: "#2D2A26",
  textSecondary: "#6B6560",
  cream: "#FAF7F2",
  clay: "#B8956A",
  moss: "#7A8B6E",
};

// Warm up browser on Android for better UX
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === "web") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  useWarmUpBrowser();

  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async () => {
    if (!isLoaded || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else if (result.status === "missing_requirements") {
        // Check if email verification is needed
        if (result.unverifiedFields?.includes("email_address")) {
          setError("Please check your email to verify your account.");
        } else {
          setError("Please complete all required fields.");
        }
      } else {
        console.error("[Register] Unexpected status:", result.status, result);
        setError("Registration requires additional verification.");
      }
    } catch (err: any) {
      console.error("[Register] Error:", err);
      const errorMessage =
        err.errors?.[0]?.message || err.message || "Registration failed";

      // Provide more user-friendly error messages
      if (errorMessage.includes("email")) {
        setError("Invalid email address or email already in use.");
      } else if (errorMessage.includes("password")) {
        setError("Password is too weak. Please use at least 8 characters.");
      } else if (errorMessage.includes("already exists")) {
        setError("An account with this email already exists. Please sign in.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    setError("");

    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl:
          Platform.OS === "web"
            ? Linking.createURL("/")
            : Linking.createURL("/", { scheme: "alora" }),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError("Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }, [startOAuthFlow, googleLoading, router]);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Subtle Organic Background Pattern */}
      <LinearGradient
        colors={["#FAF7F2", "#F5F0E8", "#FAF7F2"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Celestial Elements */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={
          {
            type: "timing",
            duration: 4500,
            loop: true,
            repeatReverse: true,
          } as any
        }
        className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full"
        style={{ backgroundColor: COLORS.secondary }}
      />
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={
          {
            type: "timing",
            duration: 5500,
            loop: true,
            delay: 2000,
            repeatReverse: true,
          } as any
        }
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full"
        style={{ backgroundColor: COLORS.accent }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              opacity: { type: "timing", duration: 700 },
              translateY: { type: "timing", duration: 700 },
            }}
            className="items-center mb-6"
          >
            <Logo size={70} showText />
          </MotiView>

          {/* Register Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              opacity: { type: "timing", duration: 700, delay: 200 },
              translateY: { type: "timing", duration: 700, delay: 200 },
            }}
          >
            <Card
              variant="default"
              className="w-full max-w-sm mx-auto p-8 shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderWidth: 1,
                borderColor: "rgba(139, 154, 125, 0.2)",
                borderRadius: 24,
              }}
            >
              <Text
                variant="title"
                className="text-center mb-2"
                style={{
                  color: COLORS.textPrimary,
                  fontFamily: "CrimsonPro-SemiBold",
                  fontSize: 32,
                }}
              >
                Create Account
              </Text>
              <Text
                variant="subtitle"
                className="text-center mb-8"
                style={{
                  color: COLORS.textSecondary,
                  fontFamily: "DMSans-Regular",
                  fontSize: 15,
                }}
              >
                Begin your parenting journey with Alora
              </Text>

              {error ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-row items-center p-4 rounded-xl mb-5 gap-2"
                  style={{
                    backgroundColor: "rgba(212, 165, 116, 0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(212, 165, 116, 0.3)",
                  }}
                >
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text
                    className="text-sm flex-1"
                    style={{
                      color: COLORS.primary,
                      fontFamily: "DMSans-Medium",
                    }}
                  >
                    {error}
                  </Text>
                </MotiView>
              ) : null}

              {/* Google OAuth Button */}
              <Button
                variant="outline"
                onPress={handleGoogleSignUp}
                disabled={googleLoading}
                className="mb-5 flex-row items-center justify-center gap-2 rounded-xl"
                style={{
                  borderWidth: 1.5,
                  borderColor: "rgba(139, 154, 125, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  paddingVertical: 14,
                }}
              >
                {googleLoading ? (
                  <ActivityIndicator color={COLORS.secondary} />
                ) : (
                  <>
                    <Ionicons
                      name="logo-google"
                      size={20}
                      color={COLORS.textPrimary}
                    />
                    <Text
                      className="font-semibold"
                      style={{
                        color: COLORS.textPrimary,
                        fontFamily: "DMSans-SemiBold",
                        fontSize: 15,
                      }}
                    >
                      Continue with Google
                    </Text>
                  </>
                )}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center mb-5">
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: "rgba(139, 154, 125, 0.3)" }}
                />
                <Text
                  className="mx-4 text-sm"
                  style={{
                    color: COLORS.textSecondary,
                    fontFamily: "DMSans-Regular",
                  }}
                >
                  or
                </Text>
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: "rgba(139, 154, 125, 0.3)" }}
                />
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <View
                  className="flex-row items-center rounded-xl px-4 py-3.5"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderColor: "rgba(139, 154, 125, 0.3)",
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <TextInput
                    className="flex-1 ml-3 text-[16px]"
                    style={{
                      color: COLORS.textPrimary,
                      fontFamily: "DMSans-Regular",
                    }}
                    placeholder="Email"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    cursorColor={COLORS.primary}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <View
                  className="flex-row items-center rounded-xl px-4 py-3.5"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderColor: "rgba(139, 154, 125, 0.3)",
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <TextInput
                    className="flex-1 ml-3 text-[16px]"
                    style={{
                      color: COLORS.textPrimary,
                      fontFamily: "DMSans-Regular",
                    }}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    cursorColor={COLORS.primary}
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <Button
                variant="primary"
                onPress={handleRegister}
                disabled={loading}
                className="w-full rounded-xl"
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 16,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "DMSans-SemiBold",
                      fontSize: 16,
                    }}
                  >
                    Create Account
                  </Text>
                )}
              </Button>

              {/* Sign In Link */}
              <Button
                variant="ghost"
                onPress={() => router.back()}
                className="mt-6"
              >
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontFamily: "DMSans-Regular",
                  }}
                >
                  Already have an account?{" "}
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontFamily: "DMSans-SemiBold",
                    }}
                  >
                    Sign in
                  </Text>
                </Text>
              </Button>
            </Card>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
});

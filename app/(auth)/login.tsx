import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useAuth, useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import { AloraLogo } from "@/components/atoms/AloraLogo";
import { GlassCard } from "@/components/atoms/GlassCard";
import {
  GRADIENTS,
  SHADOWS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  TEXT,
  COLORS,
} from "@/lib/theme";
import type { MotiTransition } from "@/lib/moti-types";

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

export default function LoginScreen() {
  useWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const handleLogin = async () => {
    if (!isLoaded || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    setError("");

    try {
      if (!isAuthLoaded) {
        return;
      }
      if (isAuthLoaded && isSignedIn) {
        if (Platform.OS === "web") {
          (globalThis as any).location?.assign?.(Linking.createURL("/"));
          return;
        }
        router.replace("/");
        return;
      }

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
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Google sign-in failed. Please try again.";
      if (
        typeof message === "string" &&
        (message.includes("already signed in") ||
          message.toLowerCase().includes("session already exists"))
      ) {
        if (Platform.OS === "web") {
          (globalThis as any).location?.assign?.(Linking.createURL("/"));
          return;
        }
        router.replace("/");
        return;
      }
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLoading, isAuthLoaded, isSignedIn, router, startOAuthFlow]);

  return (
    <LinearGradient
      colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative floating circles */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={
          { type: "timing", duration: 800, delay: 200 } as MotiTransition
        }
        style={[styles.floatingCircle, styles.circle1]}
      />
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={
          { type: "timing", duration: 800, delay: 400 } as MotiTransition
        }
        style={[styles.floatingCircle, styles.circle2]}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
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
            transition={{ type: "timing", duration: 500 } as MotiTransition}
            style={styles.logoContainer}
          >
            <AloraLogo size={80} showText />
          </MotiView>

          {/* Login Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={
              { type: "timing", duration: 500, delay: 200 } as MotiTransition
            }
          >
            <GlassCard style={styles.card}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              {error ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.errorContainer}
                >
                  <Ionicons name="alert-circle" size={18} color={COLORS.rose} />
                  <Text style={styles.error}>{error}</Text>
                </MotiView>
              ) : null}

              {/* Google OAuth Button */}
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={handleGoogleSignIn}
                disabled={googleLoading || !isAuthLoaded}
              >
                {googleLoading ? (
                  <ActivityIndicator color={TEXT.primary} />
                ) : (
                  <>
                    <Ionicons
                      name="logo-google"
                      size={20}
                      color={TEXT.primary}
                    />
                    <Text style={styles.oauthButtonText}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={TEXT.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={TEXT.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={TEXT.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={TEXT.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Sign In</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push("/(auth)/register")}
              >
                <Text style={styles.linkTextSecondary}>
                  Don't have an account?{" "}
                </Text>
                <Text style={styles.linkText}>Sign up</Text>
              </TouchableOpacity>
            </GlassCard>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    ...TYPOGRAPHY.headings.h2,
    color: TEXT.primary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body.regular,
    color: TEXT.secondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  error: {
    ...TYPOGRAPHY.body.small,
    color: COLORS.rose,
    flex: 1,
  },
  oauthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  oauthButtonText: {
    ...TYPOGRAPHY.body.large,
    fontWeight: "600",
    color: TEXT.primary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.slate[200],
  },
  dividerText: {
    ...TYPOGRAPHY.body.small,
    color: TEXT.tertiary,
    marginHorizontal: SPACING.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.slate[200],
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  inputIcon: {
    paddingLeft: SPACING.md,
  },
  input: {
    flex: 1,
    padding: SPACING.md,
    fontSize: 16,
    color: TEXT.primary,
  },
  primaryButton: {
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginTop: SPACING.sm,
    ...SHADOWS.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: "#fff",
  },
  linkButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  linkTextSecondary: {
    ...TYPOGRAPHY.body.regular,
    color: TEXT.secondary,
  },
  linkText: {
    ...TYPOGRAPHY.body.regular,
    color: COLORS.indigo,
    fontWeight: "600",
  },
  floatingCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
});

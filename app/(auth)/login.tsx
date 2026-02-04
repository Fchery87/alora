import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useAuth, useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { cssInterop } from "react-native-css-interop";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { AloraLogo } from "@/components/atoms/AloraLogo";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientButton } from "@/components/atoms/GradientButton";
import { Input } from "@/components/atoms/Input";
import { Text } from "@/components/ui/Text";
import { getInitialHref } from "@/lib/routing";
import { COLORS, GRADIENTS, SHADOWS, BACKGROUND } from "@/lib/theme";

cssInterop(MotiView, { className: "style" });

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
  const {
    isSignedIn,
    isLoaded: isAuthLoaded,
    orgId,
  } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const postAuthHref = useMemo(
    () => getInitialHref({ isSignedIn: true, orgId }),
    [orgId]
  );

  const redirectAfterAuth = useCallback(() => {
    router.replace(postAuthHref as any);
  }, [postAuthHref, router]);

  const hardRedirectAfterAuth = useCallback(() => {
    if (Platform.OS === "web") {
      const url = Linking.createURL(postAuthHref);
      (globalThis as any).location?.assign?.(url);
      return;
    }
    redirectAfterAuth();
  }, [postAuthHref, redirectAfterAuth]);

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      redirectAfterAuth();
    }
  }, [isAuthLoaded, isSignedIn, redirectAfterAuth]);

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
      } else if (result.status === "needs_first_factor") {
        setError("Please check your email for a verification code.");
      } else if (result.status === "needs_second_factor") {
        setError("Two-factor authentication required.");
      } else {
        console.error("[Login] Unexpected sign-in status:", result.status);
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("[Login] Error:", err);
      const errorMessage =
        err.errors?.[0]?.message || err.message || "Login failed";

      if (errorMessage.includes("identifier")) {
        setError("Invalid email address.");
      } else if (errorMessage.includes("password")) {
        setError("Invalid password.");
      } else if (errorMessage.includes("not found")) {
        setError("Account not found. Please check your email or sign up.");
      } else {
        setError(errorMessage);
      }
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
        redirectAfterAuth();
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
        hardRedirectAfterAuth();
        return;
      }
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  }, [
    googleLoading,
    isAuthLoaded,
    isSignedIn,
    redirectAfterAuth,
    hardRedirectAfterAuth,
    startOAuthFlow,
  ]);

  return (
    <View className="flex-1" style={{ backgroundColor: BACKGROUND.primary }}>
      {/* Subtle Organic Background Pattern */}
      <LinearGradient
        colors={[BACKGROUND.primary, BACKGROUND.secondary, BACKGROUND.primary]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Celestial Elements */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{
          type: "timing",
          duration: 4000,
          loop: true,
          repeatReverse: true,
        }}
        className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full"
        style={{ backgroundColor: COLORS.terracotta }}
      />
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{
          type: "timing",
          duration: 5000,
          loop: true,
          delay: 1500,
          repeatReverse: true,
        }}
        className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full"
        style={{ backgroundColor: COLORS.sage }}
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
            className="items-center mb-10"
          >
            <AloraLogo size={100} showText={false} />
          </MotiView>

          {/* Login Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              opacity: { type: "timing", duration: 700, delay: 200 },
              translateY: { type: "timing", duration: 700, delay: 200 },
            }}
          >
            <GlassCard variant="default" size="lg" style={styles.card}>
              <Text
                variant="h2"
                color="primary"
                className="text-center mb-2"
                style={{ fontFamily: "CrimsonPro-SemiBold" }}
              >
                Welcome Back
              </Text>
              <Text
                variant="body"
                color="secondary"
                className="text-center mb-8"
              >
                Sign in to continue your journey
              </Text>

              {error ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-row items-center p-4 rounded-xl mb-5 gap-2"
                  style={styles.errorContainer}
                >
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={COLORS.terracotta}
                  />
                  <Text
                    className="text-sm flex-1"
                    color="terracotta"
                    style={{ fontFamily: "DMSans-Medium" }}
                  >
                    {error}
                  </Text>
                </MotiView>
              ) : null}

              {/* Google OAuth Button */}
              <GradientButton
                variant="outline"
                onPress={handleGoogleSignIn}
                loading={googleLoading || !isAuthLoaded}
                style={styles.googleButton}
                icon={
                  <Ionicons
                    name="logo-google"
                    size={20}
                    color={COLORS.warmDark}
                  />
                }
              >
                Continue with Google
              </GradientButton>

              {/* Divider */}
              <View className="flex-row items-center mb-5">
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: "rgba(139, 154, 125, 0.3)" }}
                />
                <Text className="mx-4 text-sm" color="secondary">
                  or
                </Text>
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: "rgba(139, 154, 125, 0.3)" }}
                />
              </View>

              {/* Email Input */}
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={
                  <Ionicons name="mail-outline" size={20} color={COLORS.sage} />
                }
                animated={true}
                delay={300}
              />

              {/* Password Input */}
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.sage}
                  />
                }
                animated={true}
                delay={400}
              />

              {/* Sign In Button */}
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 500 }}
              >
                <GradientButton
                  variant="primary"
                  onPress={handleLogin}
                  loading={loading}
                  size="lg"
                  style={styles.signInButton}
                >
                  Sign In
                </GradientButton>
              </MotiView>

              {/* Sign Up Link */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 600 }}
                className="mt-6 items-center"
              >
                <GradientButton
                  variant="ghost"
                  onPress={() => router.push("/(auth)/register")}
                  size="md"
                >
                  Don't have an account? Sign up
                </GradientButton>
              </MotiView>
            </GlassCard>
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
  card: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  errorContainer: {
    backgroundColor: "rgba(212, 165, 116, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.3)",
  },
  googleButton: {
    marginBottom: 20,
  },
  signInButton: {
    marginTop: 8,
    ...SHADOWS.glow,
  },
});

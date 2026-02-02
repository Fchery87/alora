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
import { useAuth, useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { cssInterop } from "react-native-css-interop";
import { Ionicons } from "@expo/vector-icons";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

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
    <View className="flex-1 bg-nano-950">
      {/* Decorative Background Elements */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={
          {
            type: "timing",
            duration: 2000,
            loop: true,
            repeatReverse: true,
          } as any
        }
        className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-banana-500 rounded-full blur-[100px]"
      />
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={
          {
            type: "timing",
            duration: 3000,
            loop: true,
            delay: 1000,
            repeatReverse: true,
          } as any
        }
        className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-banana-600 rounded-full blur-[80px]"
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
            <Logo size={80} showText />
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
            <Card
              variant="default"
              className="w-full max-w-sm mx-auto bg-nano-900/90 border-nano-800 p-6 shadow-2xl"
            >
              <Text variant="title" className="text-center mb-1 text-white">
                Welcome Back
              </Text>
              <Text
                variant="subtitle"
                className="text-center mb-8 text-nano-400"
              >
                Sign in to your account
              </Text>

              {error ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-row items-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4 gap-2"
                >
                  <Ionicons name="alert-circle" size={18} color="#EF4444" />
                  <Text className="text-red-500 text-sm flex-1 font-medium">
                    {error}
                  </Text>
                </MotiView>
              ) : null}

              {/* Google OAuth Button */}
              <Button
                variant="outline"
                onPress={handleGoogleSignIn}
                disabled={googleLoading || !isAuthLoaded}
                className="mb-6 flex-row items-center justify-center gap-2 border-nano-700 bg-nano-800/50 hover:bg-nano-800"
              >
                {googleLoading ? (
                  <ActivityIndicator color="#FFE135" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="white" />
                    <Text className="text-white font-semibold">
                      Continue with Google
                    </Text>
                  </>
                )}
              </Button>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-nano-800" />
                <Text className="mx-4 text-nano-600 text-sm">or</Text>
                <View className="flex-1 h-[1px] bg-nano-800" />
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <View className="flex-row items-center bg-nano-950 border border-nano-800 rounded-xl px-4 py-3.5 focus:border-banana-500">
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 ml-3 text-white font-medium text-[16px]"
                    placeholder="Email"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    cursorColor="#FFE135"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <View className="flex-row items-center bg-nano-950 border border-nano-800 rounded-xl px-4 py-3.5 focus:border-banana-500">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 ml-3 text-white font-medium text-[16px]"
                    placeholder="Password"
                    placeholderTextColor="#555"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    cursorColor="#FFE135"
                  />
                </View>
              </View>

              {/* Sign In Button */}
              <Button
                variant="primary"
                onPress={handleLogin}
                disabled={loading}
                className="w-full shadow-lg shadow-banana-500/20"
              >
                {loading ? <ActivityIndicator color="black" /> : "Sign In"}
              </Button>

              {/* Sign Up Link */}
              <Button
                variant="ghost"
                onPress={() => router.push("/(auth)/register")}
                className="mt-6"
              >
                <Text className="text-nano-400">
                  Don't have an account?{" "}
                  <Text className="text-banana-500 font-bold">Sign up</Text>
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

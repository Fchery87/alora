import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  useSignIn,
  useOrganization,
  useOrganizationList,
} from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { setActive: setActiveOrg } = useOrganizationList();
  const { organization } = useOrganization();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsOrgSelection, setNeedsOrgSelection] = useState(false);

  useEffect(() => {
    if (organization) {
      router.replace("/(tabs)/dashboard");
    }
  }, [organization]);

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
        setNeedsOrgSelection(true);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async () => {
    router.push("/(auth)/onboarding");
  };

  if (needsOrgSelection) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Organization</Text>
        <Text style={styles.subtitle}>
          Choose or create an organization to continue
        </Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateOrganization}
        >
          <Text style={styles.createButtonText}>Create New Organization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setNeedsOrgSelection(false)}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  error: {
    color: "#ef4444",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: "#6366f1",
    marginTop: 24,
    fontSize: 16,
  },
  orgList: {
    width: "100%",
    marginBottom: 24,
  },
  orgCard: {
    width: "100%",
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginBottom: 12,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  createButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#10b981",
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
  },
  backButtonText: {
    color: "#6366f1",
    fontSize: 14,
  },
});

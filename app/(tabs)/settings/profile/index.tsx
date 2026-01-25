import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Profile" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            <Pressable style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.avatarLabel}>Tap to change photo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#64748b" />
              <Text style={styles.readonlyValue}>{user?.fullName || "—"}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#64748b" />
              <Text style={styles.readonlyValue}>
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#64748b" />
              <Text style={styles.readonlyValue}>
                {user?.primaryPhoneNumber?.phoneNumber || "—"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>

          <Pressable style={styles.accountRow}>
            <View style={styles.accountInfo}>
              <View
                style={[styles.accountIcon, { backgroundColor: "#3b82f120" }]}
              >
                <Ionicons name="people" size={20} color="#3b82f1" />
              </View>
              <View>
                <Text style={styles.accountName}>Clerk Account</Text>
                <Text style={styles.accountEmail}>Signed in</Text>
              </View>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <Pressable
            style={styles.dangerButton}
            onPress={async () => {
              await signOut();
              router.replace("/(auth)/login");
            }}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={styles.dangerButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  readonlyValue: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  accountEmail: {
    fontSize: 13,
    color: "#64748b",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});

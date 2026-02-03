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
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

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
              <Ionicons name="person" size={20} color={COLORS.terracotta} />
              <Text style={styles.readonlyValue}>{user?.fullName || "—"}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={COLORS.sage} />
              <Text style={styles.readonlyValue}>
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color={COLORS.gold} />
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
                style={[
                  styles.accountIcon,
                  { backgroundColor: `${COLORS.sage}15` },
                ]}
              >
                <Ionicons name="people" size={20} color={COLORS.sage} />
              </View>
              <View>
                <Text style={styles.accountName}>Clerk Account</Text>
                <Text style={styles.accountEmail}>Signed in</Text>
              </View>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.sage} />
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
            <Ionicons name="log-out" size={20} color={COLORS.clay} />
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
    backgroundColor: BACKGROUND.primary,
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
    borderWidth: 3,
    borderColor: GLASS.light.border,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.terracotta,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: BACKGROUND.card,
    ...SHADOWS.sm,
  },
  avatarLabel: {
    fontSize: 14,
    fontFamily: "DMSans",
    color: TEXT.secondary,
    marginTop: 8,
  },
  section: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSansMedium",
    color: TEXT.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "DMSansMedium",
    color: TEXT.secondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.primary,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  readonlyValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans",
    color: TEXT.primary,
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
    fontFamily: "DMSansMedium",
    color: TEXT.primary,
  },
  accountEmail: {
    fontSize: 13,
    fontFamily: "DMSans",
    color: TEXT.secondary,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${COLORS.clay}10`,
    padding: 16,
    borderRadius: RADIUS.md,
    gap: 8,
    borderWidth: 1,
    borderColor: `${COLORS.clay}30`,
  },
  dangerButtonText: {
    color: COLORS.clay,
    fontSize: 16,
    fontFamily: "DMSansMedium",
  },
});

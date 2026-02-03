import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "@/lib/theme";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const initials =
    user?.firstName?.[0] ||
    user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
    "?";

  const displayName = user?.fullName || user?.emailAddresses[0]?.emailAddress;
  const email = user?.emailAddresses[0]?.emailAddress;

  const menuItems = [
    {
      icon: "person-outline",
      label: "Personal Information",
      description: "Update your profile details",
      color: COLORS.terracotta,
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      description: "Manage alerts and reminders",
      color: COLORS.gold,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      description: "Security settings and privacy",
      color: COLORS.sage,
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      description: "Get assistance and FAQs",
      color: COLORS.moss,
    },
  ];

  return (
    <OrganicBackground showBlobs={true} showGrain={true}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            </View>
            <Text variant="h1" color="primary" style={styles.name}>
              {displayName}
            </Text>
            <Text variant="body" color="tertiary" style={styles.email}>
              {email}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <Card variant="soft" style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: "rgba(212, 165, 116, 0.15)" },
                ]}
              >
                <Ionicons name="calendar" size={20} color={COLORS.terracotta} />
              </View>
              <Text variant="h2" color="primary" style={styles.statValue}>
                12
              </Text>
              <Text variant="caption" color="tertiary" style={styles.statLabel}>
                Days tracked
              </Text>
            </Card>
            <Card variant="soft" style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: "rgba(139, 154, 125, 0.15)" },
                ]}
              >
                <Ionicons name="heart" size={20} color={COLORS.sage} />
              </View>
              <Text variant="h2" color="primary" style={styles.statValue}>
                48
              </Text>
              <Text variant="caption" color="tertiary" style={styles.statLabel}>
                Activities
              </Text>
            </Card>
            <Card variant="soft" style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: "rgba(201, 162, 39, 0.15)" },
                ]}
              >
                <Ionicons name="trophy" size={20} color={COLORS.gold} />
              </View>
              <Text variant="h2" color="primary" style={styles.statValue}>
                5
              </Text>
              <Text variant="caption" color="tertiary" style={styles.statLabel}>
                Milestones
              </Text>
            </Card>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <Text
              variant="subtitle"
              color="tertiary"
              style={styles.sectionTitle}
            >
              Settings
            </Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItemWrapper}
                activeOpacity={0.7}
              >
                <Card variant="elevated" style={styles.menuItem}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.menuContent}>
                    <Text
                      variant="body"
                      color="primary"
                      style={styles.menuLabel}
                    >
                      {item.label}
                    </Text>
                    <Text
                      variant="caption"
                      color="tertiary"
                      style={styles.menuDescription}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.stone}
                  />
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <View style={styles.signOutContent}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.clay} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text variant="caption" color="tertiary" style={styles.versionText}>
              Alora v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </OrganicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.terracotta,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "CrimsonProBold",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.sage,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    textAlign: "center",
    marginBottom: 6,
  },
  email: {
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    marginBottom: 2,
  },
  statLabel: {
    textAlign: "center",
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  menuItemWrapper: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    ...SHADOWS.sm,
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontWeight: "600",
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  signOutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(193, 122, 92, 0.25)",
    shadowColor: COLORS.clay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutText: {
    color: COLORS.clay,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  versionText: {
    opacity: 0.6,
  },
});

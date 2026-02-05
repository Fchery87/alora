import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Text,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";
import { color, font, radius, space, typeScale } from "@/lib/design/careJournal/tokens";

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
      pigment: color.pigment.clay,
      onPress: () => router.push("/(tabs)/settings/profile"),
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      description: "Manage alerts and reminders",
      pigment: color.pigment.marigold,
      onPress: () => router.push("/(tabs)/settings/notifications"),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      description: "Security settings and privacy",
      pigment: color.pigment.sage,
      onPress: () => router.push("/(tabs)/settings/privacy"),
    },
    {
      icon: "color-palette-outline",
      label: "Appearance",
      description: "Theme, contrast, and motion",
      pigment: color.pigment.skyInfo,
      onPress: () => router.push("/(tabs)/settings/appearance"),
    },
    {
      icon: "book-outline",
      label: "Resources",
      description: "Guides and reading list",
      pigment: color.ink.faint,
      onPress: () => router.push("/(tabs)/resources"),
    },
  ];

  return (
    <JournalScaffold
      title="Profile"
      subtitle="Your account, settings, and support."
      testID="care-journal-profile"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.identityCard}>
          <View style={styles.identityRow}>
            <View style={styles.avatarContainer}>
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
            </View>

            <View style={styles.identityText}>
              <Text style={styles.name} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {email}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => router.push("/(tabs)/settings/profile")}
              style={({ pressed }) => [
                styles.editButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={color.ink.strong}
              />
            </Pressable>
          </View>
        </View>

          {/* Stats Cards */}
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View
                style={[styles.statIcon, styles.statIconMarigold]}
              >
                <Ionicons
                  name="calendar"
                  size={18}
                  color={color.pigment.marigold}
                />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Days tracked</Text>
            </View>
            <View style={styles.statCard}>
              <View
                style={[styles.statIcon, styles.statIconSage]}
              >
                <Ionicons name="heart" size={18} color={color.pigment.sage} />
              </View>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statCard}>
              <View
                style={[styles.statIcon, styles.statIconClay]}
              >
                <Ionicons
                  name="trophy"
                  size={18}
                  color={color.pigment.clay}
                />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Milestones</Text>
            </View>
        </View>

          {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed ? styles.pressed : null,
              ]}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: `${item.pigment}14` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.pigment}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={color.ink.faint}
              />
            </Pressable>
          ))}
        </View>

          {/* Sign Out Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={color.pigment.rustError}
          />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Alora v1.0.0</Text>
        </View>
      </ScrollView>
    </JournalScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: space[2],
    paddingBottom: space[8],
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  identityCard: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.xl,
    backgroundColor: color.paper.wash,
    padding: space[4],
    marginTop: space[2],
    marginBottom: space[4],
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: color.paper.edge,
    backgroundColor: color.paper.base,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196, 106, 74, 0.12)",
  },
  avatarText: {
    fontFamily: font.heading.semibold,
    fontSize: 18,
    letterSpacing: 0,
    color: color.pigment.clayDeep,
  },
  name: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
  },
  email: {
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: typeScale.bodySm.letterSpacing,
    color: color.ink.muted,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.paper.edge,
    backgroundColor: color.paper.base,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: space[5],
  },
  statCard: {
    flex: 1,
    padding: space[3],
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statIconMarigold: {
    backgroundColor: "rgba(209, 165, 69, 0.14)",
  },
  statIconSage: {
    backgroundColor: "rgba(47, 107, 91, 0.12)",
  },
  statIconClay: {
    backgroundColor: "rgba(196, 106, 74, 0.12)",
  },
  statValue: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.h3.fontSize,
    lineHeight: typeScale.h3.lineHeight,
    letterSpacing: typeScale.h3.letterSpacing,
    color: color.ink.strong,
  },
  statLabel: {
    textAlign: "center",
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 0.4,
    color: color.ink.faint,
  },
  menuSection: {
    marginBottom: space[5],
  },
  sectionTitle: {
    marginBottom: space[2],
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontFamily: font.ui.medium,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    color: color.ink.faint,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: color.paper.edge,
    borderRadius: radius.lg,
    backgroundColor: color.paper.wash,
    flexDirection: "row",
    alignItems: "center",
    padding: space[3],
    gap: space[3],
    marginBottom: space[2],
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
    minWidth: 0,
  },
  menuLabel: {
    fontFamily: font.heading.semibold,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: 0.1,
    color: color.ink.strong,
  },
  menuDescription: {
    marginTop: 2,
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: typeScale.caption.letterSpacing,
    color: color.ink.muted,
  },
  signOutButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(178, 74, 60, 0.35)",
    borderRadius: radius.lg,
    backgroundColor: "rgba(178, 74, 60, 0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
    paddingHorizontal: space[4],
    paddingVertical: 12,
  },
  signOutText: {
    color: color.pigment.rustError,
    fontSize: typeScale.bodySm.fontSize,
    lineHeight: typeScale.bodySm.lineHeight,
    letterSpacing: 0.4,
    fontFamily: font.ui.semibold,
    textTransform: "uppercase",
  },
  footer: {
    alignItems: "center",
    marginTop: space[5],
  },
  versionText: {
    opacity: 0.6,
    fontFamily: font.ui.regular,
    fontSize: typeScale.caption.fontSize,
    lineHeight: typeScale.caption.lineHeight,
    color: color.ink.faint,
  },
});

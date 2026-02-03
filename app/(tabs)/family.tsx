import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

export default function FamilyScreen() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const familyMembers = [
    {
      id: "1",
      name: "You",
      role: "Parent",
      avatar: null,
      isOnline: true,
    },
    {
      id: "2",
      name: "Partner",
      role: "Parent",
      avatar: null,
      isOnline: false,
    },
  ];

  return (
    <View style={styles.screen}>
      <Header title="Family" showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          {familyMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={COLORS.terracotta} />
                {member.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={TEXT.tertiary}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.inviteButton}>
          <Ionicons name="person-add" size={20} color={COLORS.terracotta} />
          <Text style={styles.inviteButtonText}>Invite Family Member</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Caregivers</Text>
          <View style={styles.emptyCaregivers}>
            <Ionicons name="people-outline" size={48} color={TEXT.tertiary} />
            <Text style={styles.emptyText}>No additional caregivers</Text>
            <Text style={styles.emptySubtext}>
              Invite grandparents, sitters, or other helpers
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="settings-outline" size={20} color={TEXT.primary} />
            <Text style={styles.settingText}>Family Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={TEXT.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={TEXT.primary}
            />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={TEXT.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headings.h4,
    color: TEXT.primary,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.terracotta}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.sage,
    borderWidth: 2,
    borderColor: BACKGROUND.card,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: "DMSansMedium",
    color: TEXT.primary,
  },
  memberRole: {
    fontSize: 14,
    fontFamily: "DMSans",
    color: TEXT.secondary,
    marginTop: 2,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
    borderStyle: "dashed",
    gap: 8,
  },
  inviteButtonText: {
    fontSize: 14,
    fontFamily: "DMSansMedium",
    color: COLORS.terracotta,
  },
  emptyCaregivers: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "CrimsonProMedium",
    color: TEXT.secondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "DMSans",
    color: TEXT.tertiary,
    marginTop: 4,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans",
    color: TEXT.primary,
  },
});

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "expo-router";
import { useDataExport } from "@/hooks/useDataExport";
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

interface SettingsItemPress {
  icon: string;
  label: string;
  onPress: () => void;
  hasSwitch?: never;
  value?: never;
  onValueChange?: never;
}

interface SettingsItemSwitch {
  icon: string;
  label: string;
  hasSwitch: true;
  value: boolean;
  onValueChange: Dispatch<SetStateAction<boolean>>;
  onPress?: never;
}

type SettingsItem = SettingsItemPress | SettingsItemSwitch;

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { exportDataToFile, isLoading } = useDataExport();

  const settingsSections: SettingsSection[] = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline",
          label: "Profile",
          onPress: () => router.push("profile" as any),
        },
        {
          icon: "notifications-outline",
          label: "Notifications",
          onPress: () => router.push("notifications" as any),
        },
        {
          icon: "color-palette-outline",
          label: "Appearance",
          onPress: () => router.push("appearance" as any),
        },
        {
          icon: "lock-closed-outline",
          label: "Privacy & Security",
          onPress: () => router.push("privacy" as any),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "notifications-outline",
          label: "Push Notifications",
          hasSwitch: true,
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: "moon-outline",
          label: "Dark Mode",
          hasSwitch: true,
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: "analytics-outline",
          label: "Analytics",
          hasSwitch: true,
          value: analyticsEnabled,
          onValueChange: setAnalyticsEnabled,
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          icon: "download-outline",
          label: "Export Data",
          onPress: exportDataToFile,
        },
        {
          icon: "cloud-upload-outline",
          label: "Backup & Restore",
          onPress: () => console.log("Backup"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "help-circle-outline",
          label: "Help Center",
          onPress: () => console.log("Help"),
        },
        {
          icon: "chatbubble-ellipses-outline",
          label: "Send Feedback",
          onPress: () => console.log("Feedback"),
        },
        {
          icon: "information-circle-outline",
          label: "About",
          onPress: () => console.log("About"),
        },
      ],
    },
  ];

  const getIconColor = (sectionTitle: string, itemLabel: string) => {
    if (sectionTitle === "Account") {
      if (itemLabel === "Profile") return COLORS.terracotta;
      if (itemLabel === "Notifications") return COLORS.gold;
      if (itemLabel === "Appearance") return COLORS.sage;
      if (itemLabel === "Privacy & Security") return COLORS.clay;
    }
    if (sectionTitle === "Preferences") {
      return COLORS.sage;
    }
    if (sectionTitle === "Data") {
      return COLORS.gold;
    }
    if (sectionTitle === "Support") {
      return COLORS.stone;
    }
    return COLORS.terracotta;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.card}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.item,
                  itemIndex < section.items.length - 1 && styles.itemBorder,
                ]}
                onPress={item.onPress}
                disabled={
                  item.hasSwitch || (item.label === "Export Data" && isLoading)
                }
              >
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${getIconColor(section.title, item.label)}15`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={22}
                      color={getIconColor(section.title, item.label)}
                    />
                  </View>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: "#E8DED1", true: COLORS.sage }}
                    thumbColor="#fff"
                  />
                ) : item.label === "Export Data" && isLoading ? (
                  <ActivityIndicator size="small" color={COLORS.gold} />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={TEXT.tertiary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.clay} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    marginTop: 60,
  },
  title: {
    ...TYPOGRAPHY.headings.h1,
    color: TEXT.primary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: GLASS.light.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: "CareJournalUI",
    color: TEXT.primary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: `${COLORS.clay}10`,
    borderRadius: RADIUS.lg,
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: `${COLORS.clay}30`,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: COLORS.clay,
  },
  version: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.tertiary,
    marginTop: 24,
  },
});

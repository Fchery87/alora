import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "expo-router";

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
          onPress: () => console.log("Export data"),
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

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
                disabled={item.hasSwitch}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color="#6366f1"
                  />
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                    thumbColor="#fff"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: "#0f172a",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  version: {
    textAlign: "center",
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 24,
  },
});

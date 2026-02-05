import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

const AUTO_LOCK_OPTIONS = [
  { value: 1, label: "1 minute" },
  { value: 5, label: "5 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

export default function PrivacyScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(5);
  const [hideSensitiveContent, setHideSensitiveContent] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  const handleDeleteAllData = () => {
    Alert.alert(
      "Delete All Data",
      "This will permanently delete all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete data"),
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data will be exported and available for download.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Export", onPress: () => console.log("Export data") },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Privacy & Security" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.sage}15` },
                ]}
              >
                <Ionicons name="finger-print" size={22} color={COLORS.sage} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Biometric Login</Text>
                <Text style={styles.sublabel}>Use Face ID or Touch ID</Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.gold}15` },
                ]}
              >
                <Ionicons name="lock-closed" size={22} color={COLORS.gold} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Auto-Lock</Text>
                <Text style={styles.sublabel}>Lock app after inactivity</Text>
              </View>
            </View>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {AUTO_LOCK_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.pill,
                      autoLockMinutes === option.value && styles.pillActive,
                    ]}
                    onPress={() => setAutoLockMinutes(option.value)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        autoLockMinutes === option.value &&
                          styles.pillTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Privacy</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.stone}15` },
                ]}
              >
                <Ionicons name="eye-off" size={22} color={COLORS.stone} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Hide Sensitive Content</Text>
                <Text style={styles.sublabel}>Blur private entries</Text>
              </View>
            </View>
            <Switch
              value={hideSensitiveContent}
              onValueChange={setHideSensitiveContent}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.terracotta}15` },
                ]}
              >
                <Ionicons
                  name="analytics"
                  size={22}
                  color={COLORS.terracotta}
                />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Share Analytics</Text>
                <Text style={styles.sublabel}>Help improve the app</Text>
              </View>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <Pressable style={styles.actionButton} onPress={handleExportData}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${COLORS.sage}15` },
              ]}
            >
              <Ionicons name="download" size={22} color={COLORS.sage} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Export My Data</Text>
              <Text style={styles.actionSublabel}>
                Download a copy of your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={TEXT.tertiary} />
          </Pressable>

          <Pressable style={styles.dangerButton} onPress={handleDeleteAllData}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${COLORS.clay}15` },
              ]}
            >
              <Ionicons name="trash" size={22} color={COLORS.clay} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.dangerLabel}>Delete All Data</Text>
              <Text style={styles.actionSublabel}>
                Permanently remove everything
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.clay} />
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
    fontFamily: "CareJournalUIMedium",
    color: TEXT.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: GLASS.light.border,
    marginTop: 8,
    paddingTop: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContent: {
    marginLeft: 0,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.primary,
  },
  sublabel: {
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginTop: 2,
  },
  pickerContainer: {
    maxWidth: 150,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: BACKGROUND.primary,
    marginRight: 6,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  pillActive: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
  },
  pillTextActive: {
    color: "#fff",
    fontFamily: "CareJournalUIMedium",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: GLASS.light.border,
    marginTop: 8,
    paddingTop: 16,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.primary,
  },
  dangerLabel: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: COLORS.clay,
  },
  actionSublabel: {
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    marginTop: 2,
  },
});

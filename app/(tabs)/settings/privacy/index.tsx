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
              <Ionicons name="finger-print" size={22} color="#6366f1" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Biometric Login</Text>
                <Text style={styles.sublabel}>Use Face ID or Touch ID</Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: "#e2e8f0", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowContent}>
              <Ionicons name="lock-closed" size={22} color="#6366f1" />
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
              <Ionicons name="eye-off" size={22} color="#8b5cf6" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Hide Sensitive Content</Text>
                <Text style={styles.sublabel}>Blur private entries</Text>
              </View>
            </View>
            <Switch
              value={hideSensitiveContent}
              onValueChange={setHideSensitiveContent}
              trackColor={{ false: "#e2e8f0", true: "#8b5cf6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Ionicons name="analytics" size={22} color="#3b82f6" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Share Analytics</Text>
                <Text style={styles.sublabel}>Help improve the app</Text>
              </View>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <Pressable style={styles.actionButton} onPress={handleExportData}>
            <Ionicons name="download" size={22} color="#3b82f6" />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Export My Data</Text>
              <Text style={styles.actionSublabel}>
                Download a copy of your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable style={styles.dangerButton} onPress={handleDeleteAllData}>
            <Ionicons name="trash" size={22} color="#ef4444" />
            <View style={styles.actionContent}>
              <Text style={styles.dangerLabel}>Delete All Data</Text>
              <Text style={styles.actionSublabel}>
                Permanently remove everything
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    marginTop: 8,
    paddingTop: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  sublabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  pickerContainer: {
    maxWidth: 150,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    marginRight: 6,
  },
  pillActive: {
    backgroundColor: "#6366f1",
  },
  pillText: {
    fontSize: 13,
    color: "#64748b",
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "500",
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
    borderTopColor: "#f1f5f9",
    marginTop: 8,
    paddingTop: 16,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  dangerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
  },
  actionSublabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

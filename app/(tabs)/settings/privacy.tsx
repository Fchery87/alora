import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function PrivacyScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReporting, setCrashReporting] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy & Security</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons name="finger-print-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Biometric Authentication</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="lock-closed-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons name="analytics-outline" size={22} color="#6366f1" />
              <View>
                <Text style={styles.optionLabel}>Usage Analytics</Text>
                <Text style={styles.optionSublabel}>Help improve the app</Text>
              </View>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="bug-outline" size={22} color="#6366f1" />
              <View>
                <Text style={styles.optionLabel}>Crash Reporting</Text>
                <Text style={styles.optionSublabel}>Send crash reports</Text>
              </View>
            </View>
            <Switch
              value={crashReporting}
              onValueChange={setCrashReporting}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons name="download-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Download My Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
              <Text style={[styles.optionLabel, { color: "#ef4444" }]}>
                Delete My Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#6366f1"
              />
              <Text style={styles.optionLabel}>Notification Permissions</Text>
            </View>
            <Text style={styles.statusText}>Allowed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons name="camera-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Camera</Text>
            </View>
            <Text style={styles.statusText}>Allowed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="image-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Photo Library</Text>
            </View>
            <Text style={styles.statusText}>Allowed</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#0f172a",
  },
  optionSublabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#22c55e",
  },
});

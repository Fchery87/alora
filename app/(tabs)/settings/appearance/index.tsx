import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Ionicons } from "@expo/vector-icons";

type FontSize = "small" | "medium" | "large" | "extraLarge";

const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Small", fontSize: 14 },
  { value: "medium", label: "Medium", fontSize: 16 },
  { value: "large", label: "Large", fontSize: 18 },
  { value: "extraLarge", label: "Extra Large", fontSize: 20 },
];

export default function AppearanceScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <View style={styles.container}>
      <Header title="Appearance" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Ionicons name="moon" size={22} color="#6366f1" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Dark Mode</Text>
                <Text style={styles.sublabel}>Use dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e2e8f0", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Size</Text>

          <View style={styles.fontSizeGrid}>
            {FONT_SIZE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.fontSizeOption,
                  fontSize === option.value && styles.fontSizeOptionActive,
                ]}
                onPress={() => setFontSize(option.value as FontSize)}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    fontSize === option.value && styles.fontSizeTextActive,
                    { fontSize: option.fontSize },
                  ]}
                >
                  Aa
                </Text>
                <Text
                  style={[
                    styles.fontSizeLabel,
                    fontSize === option.value && styles.fontSizeLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Ionicons name="notifications-off" size={22} color="#6366f1" />
              <View style={styles.textContent}>
                <Text style={styles.label}>Reduce Motion</Text>
                <Text style={styles.sublabel}>Minimize animations</Text>
              </View>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: "#e2e8f0", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowContent}>
              <Ionicons name="contrast" size={22} color="#6366f1" />
              <View style={styles.textContent}>
                <Text style={styles.label}>High Contrast</Text>
                <Text style={styles.sublabel}>Increase text visibility</Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: "#e2e8f0", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
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
    paddingVertical: 12,
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
  fontSizeGrid: {
    flexDirection: "row",
    gap: 8,
  },
  fontSizeOption: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fontSizeOptionActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  fontSizeText: {
    color: "#64748b",
    fontWeight: "600",
  },
  fontSizeTextActive: {
    color: "#fff",
  },
  fontSizeLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  fontSizeLabelActive: {
    color: "#fff",
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

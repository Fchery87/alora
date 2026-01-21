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

export default function AppearanceScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [systemTheme, setSystemTheme] = useState(true);
  const [selectedColor, setSelectedColor] = useState("indigo");
  const [fontSize, setFontSize] = useState("medium");

  const colors = [
    { name: "indigo", color: "#6366f1" },
    { name: "purple", color: "#8b5cf6" },
    { name: "pink", color: "#ec4899" },
    { name: "blue", color: "#3b82f6" },
    { name: "teal", color: "#14b8a6" },
    { name: "green", color: "#22c55e" },
  ];

  const fontSizes = [
    { name: "Small", value: "small" },
    { name: "Medium", value: "medium" },
    { name: "Large", value: "large" },
    { name: "Extra Large", value: "xlarge" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Appearance</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.option, styles.optionBorder]}
            onPress={() => setSystemTheme(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={systemTheme ? "radio-button-on" : "radio-button-off"}
                size={22}
                color="#6366f1"
              />
              <Text style={styles.optionLabel}>System Default</Text>
            </View>
            <Text style={styles.optionSublabel}>Match device settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.optionBorder]}
            onPress={() => {
              setSystemTheme(false);
              setDarkMode(false);
            }}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={
                  !systemTheme && !darkMode
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={22}
                color="#6366f1"
              />
              <Text style={styles.optionLabel}>Light</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              setSystemTheme(false);
              setDarkMode(true);
            }}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={
                  !systemTheme && darkMode
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={22}
                color="#6366f1"
              />
              <Text style={styles.optionLabel}>Dark</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <View style={styles.colorGrid}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[
                styles.colorButton,
                { backgroundColor: c.color },
                selectedColor === c.name && styles.colorButtonActive,
              ]}
              onPress={() => setSelectedColor(c.name)}
            >
              {selectedColor === c.name && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        <View style={styles.fontGrid}>
          {fontSizes.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.fontButton,
                fontSize === f.value && styles.fontButtonActive,
              ]}
              onPress={() => setFontSize(f.value)}
            >
              <Text
                style={[
                  styles.fontButtonText,
                  fontSize === f.value && styles.fontButtonTextActive,
                ]}
              >
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.option, styles.optionBorder]}>
            <View style={styles.optionLeft}>
              <Ionicons name="moon-outline" size={22} color="#6366f1" />
              <Text style={styles.optionLabel}>Reduce Motion</Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color="#6366f1"
              />
              <Text style={styles.optionLabel}>Larger Text in App</Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#fff"
            />
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
  },
  colorGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonActive: {
    borderWidth: 3,
    borderColor: "#0f172a",
  },
  fontGrid: {
    flexDirection: "row",
    gap: 8,
  },
  fontButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  fontButtonActive: {
    borderColor: "#6366f1",
    backgroundColor: "#f1f5f9",
  },
  fontButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  fontButtonTextActive: {
    color: "#6366f1",
  },
});

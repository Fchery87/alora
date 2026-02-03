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
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

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
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.stone}15` },
                ]}
              >
                <Ionicons name="moon" size={22} color={COLORS.stone} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Dark Mode</Text>
                <Text style={styles.sublabel}>Use dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
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
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${COLORS.terracotta}15` },
                ]}
              >
                <Ionicons
                  name="notifications-off"
                  size={22}
                  color={COLORS.terracotta}
                />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>Reduce Motion</Text>
                <Text style={styles.sublabel}>Minimize animations</Text>
              </View>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
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
                <Ionicons name="contrast" size={22} color={COLORS.gold} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>High Contrast</Text>
                <Text style={styles.sublabel}>Increase text visibility</Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
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
    fontFamily: "DMSansMedium",
    color: TEXT.tertiary,
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
    fontFamily: "DMSansMedium",
    color: TEXT.primary,
  },
  sublabel: {
    fontSize: 13,
    fontFamily: "DMSans",
    color: TEXT.secondary,
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
    borderRadius: RADIUS.md,
    backgroundColor: BACKGROUND.primary,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  fontSizeOptionActive: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.sage,
  },
  fontSizeText: {
    color: TEXT.secondary,
    fontFamily: "CrimsonProMedium",
    fontWeight: "600",
  },
  fontSizeTextActive: {
    color: "#fff",
  },
  fontSizeLabel: {
    fontSize: 10,
    fontFamily: "DMSans",
    color: TEXT.tertiary,
    marginTop: 4,
  },
  fontSizeLabelActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: COLORS.terracotta,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSansMedium",
  },
});

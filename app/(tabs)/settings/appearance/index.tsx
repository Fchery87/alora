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
import { RADIUS, COLORS } from "@/lib/theme";
import { useTheme, ThemeMode } from "@/components/providers/ThemeProvider";

type FontSize = "small" | "medium" | "large" | "extraLarge";

const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Small", fontSize: 14 },
  { value: "medium", label: "Medium", fontSize: 16 },
  { value: "large", label: "Large", fontSize: 18 },
  { value: "extraLarge", label: "Extra Large", fontSize: 20 },
];

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "light", label: "Light", icon: "sunny" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "auto", label: "Auto", icon: "phone-portrait" },
];

export default function AppearanceScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <Header title="Appearance" showBackButton />

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.background.card,
              borderColor: theme.glass.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>
            Theme
          </Text>

          <View style={styles.themeGrid}>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.themeOption,
                  themeMode === option.value && [
                    styles.themeOptionActive,
                    { borderColor: theme.colors.primary },
                  ],
                  { backgroundColor: theme.background.secondary },
                ]}
                onPress={() => setThemeMode(option.value)}
              >
                <View
                  style={[
                    styles.themeIconContainer,
                    {
                      backgroundColor:
                        themeMode === option.value
                          ? `${theme.colors.primary}20`
                          : `${theme.colors.stone}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={
                      themeMode === option.value
                        ? theme.colors.primary
                        : theme.colors.stone
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.themeLabel,
                    {
                      color:
                        themeMode === option.value
                          ? theme.text.primary
                          : theme.text.secondary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.background.card,
              borderColor: theme.glass.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>
            Text Size
          </Text>

          <View style={styles.fontSizeGrid}>
            {FONT_SIZE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.fontSizeOption,
                  fontSize === option.value && [
                    styles.fontSizeOptionActive,
                    {
                      backgroundColor: theme.colors.sage,
                      borderColor: theme.colors.sage,
                    },
                  ],
                  {
                    backgroundColor: theme.background.primary,
                    borderColor: theme.glass.border,
                  },
                ]}
                onPress={() => setFontSize(option.value as FontSize)}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    fontSize === option.value && styles.fontSizeTextActive,
                    {
                      fontSize: option.fontSize,
                      color:
                        fontSize === option.value
                          ? "#fff"
                          : theme.text.secondary,
                    },
                  ]}
                >
                  Aa
                </Text>
                <Text
                  style={[
                    styles.fontSizeLabel,
                    fontSize === option.value && styles.fontSizeLabelActive,
                    {
                      color:
                        fontSize === option.value
                          ? "#fff"
                          : theme.text.tertiary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.background.card,
              borderColor: theme.glass.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>
            Accessibility
          </Text>

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
                <Text style={[styles.label, { color: theme.text.primary }]}>
                  Reduce Motion
                </Text>
                <Text
                  style={[styles.sublabel, { color: theme.text.secondary }]}
                >
                  Minimize animations
                </Text>
              </View>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: "#E8DED1", true: COLORS.sage }}
              thumbColor="#fff"
            />
          </View>

          <View
            style={[
              styles.row,
              styles.rowBorder,
              { borderTopColor: theme.glass.border },
            ]}
          >
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
                <Text style={[styles.label, { color: theme.text.primary }]}>
                  High Contrast
                </Text>
                <Text
                  style={[styles.sublabel, { color: theme.text.secondary }]}
                >
                  Increase text visibility
                </Text>
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

        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.terracotta, ...theme.shadows.sm },
          ]}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSansMedium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: "row",
    gap: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeOptionActive: {
    borderWidth: 2,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 13,
    fontFamily: "DMSansMedium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
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
  },
  sublabel: {
    fontSize: 13,
    fontFamily: "DMSans",
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
    borderWidth: 1,
  },
  fontSizeOptionActive: {
    borderWidth: 1,
  },
  fontSizeText: {
    fontFamily: "CrimsonProMedium",
    fontWeight: "600",
  },
  fontSizeTextActive: {
    color: "#fff",
  },
  fontSizeLabel: {
    fontSize: 10,
    fontFamily: "DMSans",
    marginTop: 4,
  },
  fontSizeLabelActive: {
    color: "#fff",
  },
  saveButton: {
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSansMedium",
  },
});

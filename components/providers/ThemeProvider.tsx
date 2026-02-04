import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useColorScheme, Appearance, StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeMode, lightTheme, darkTheme } from "@/lib/theme";

export type { ThemeMode };

const THEME_STORAGE_KEY = "@alora_theme_mode";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultTheme = "auto",
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === "auto") {
        // Theme will update automatically via systemColorScheme
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  // Save theme preference when changed
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const currentEffectiveTheme =
      themeMode === "auto" ? systemColorScheme || "light" : themeMode;
    const newMode = currentEffectiveTheme === "light" ? "dark" : "light";
    setThemeMode(newMode);
  }, [themeMode, systemColorScheme, setThemeMode]);

  // Determine effective theme
  const effectiveTheme = useMemo(() => {
    if (themeMode === "auto") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const isDark = effectiveTheme.mode === "dark";

  const value = useMemo(
    () => ({
      theme: effectiveTheme,
      themeMode,
      setThemeMode,
      toggleTheme,
      isDark,
    }),
    [effectiveTheme, themeMode, setThemeMode, toggleTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={effectiveTheme.background.primary}
        translucent={Platform.OS === "android"}
      />
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to get just the theme object (convenience)
export function useThemeStyles(): Theme {
  const { theme } = useTheme();
  return theme;
}

// Hook to check if dark mode is active
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

// Hook to toggle theme
export function useToggleTheme(): () => void {
  const { toggleTheme } = useTheme();
  return toggleTheme;
}

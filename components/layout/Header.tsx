import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { COLORS, SHADOWS } from "@/lib/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function Header({
  title,
  showBackButton = false,
  rightAction,
}: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View
      className="flex-row items-center justify-between px-4 py-4 bg-cream-100 border-b border-cream-300"
      style={styles.container}
    >
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            className="p-2 rounded-full active:bg-cream-200"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.terracotta} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        variant="title"
        className="flex-1 text-center text-lg font-heading font-bold text-charcoal-900"
        numberOfLines={1}
      >
        {title}
      </Text>

      <View className="w-10 items-end">
        {rightAction && (
          <TouchableOpacity
            className="p-2 rounded-full active:bg-cream-200"
            onPress={rightAction.onPress}
          >
            <Ionicons
              name={rightAction.icon}
              size={24}
              color={COLORS.terracotta}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: SHADOWS.sm.shadowColor,
    shadowOffset: SHADOWS.sm.shadowOffset,
    shadowOpacity: SHADOWS.sm.shadowOpacity,
    shadowRadius: SHADOWS.sm.shadowRadius,
    elevation: SHADOWS.sm.elevation,
  },
});

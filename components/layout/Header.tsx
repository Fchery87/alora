import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { BACKGROUND, COLORS, SHADOWS, TEXT } from "@/lib/theme";

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
      testID="header"
      style={styles.container}
    >
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            className="p-2 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.terracotta} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        variant="title"
        className="flex-1 text-center"
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View className="w-10 items-end">
        {rightAction && (
          <TouchableOpacity
            className="p-2 rounded-full"
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: BACKGROUND.primary,
    borderBottomWidth: 1,
    borderBottomColor: BACKGROUND.tertiary,
    shadowColor: SHADOWS.sm.shadowColor,
    shadowOffset: SHADOWS.sm.shadowOffset,
    shadowOpacity: SHADOWS.sm.shadowOpacity,
    shadowRadius: SHADOWS.sm.shadowRadius,
    elevation: SHADOWS.sm.elevation,
  },
  title: {
    color: TEXT.primary,
  },
});

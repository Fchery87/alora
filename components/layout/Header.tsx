import { View, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";

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
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-nano-950 border-b border-nano-800">
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            className="p-2"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFE135" />
          </TouchableOpacity>
        )}
      </View>

      <Text variant="title" className="flex-1 text-center text-lg font-bold text-white" numberOfLines={1}>
        {title}
      </Text>

      <View className="w-10 items-end">
        {rightAction && (
          <TouchableOpacity
            className="p-2"
            onPress={rightAction.onPress}
          >
            <Ionicons name={rightAction.icon} size={24} color="#FFE135" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}



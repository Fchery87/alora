import { View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Text } from "./ui/Text";
import { COLORS } from "@/lib/theme";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = 40,
  showText = true,
  className = "",
}: LogoProps) {
  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      <View className="relative">
        {/* Alora Icon - A stylized celestial leaf representing nurturing growth */}
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {/* Warm background circle */}
          <Circle cx="20" cy="20" r="18" fill={COLORS.cream} />
          <Circle
            cx="20"
            cy="20"
            r="18"
            stroke={COLORS.terracotta}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Alora Leaf/Flame - Terracotta and Gold gradient effect */}
          <Path
            d="M20 8C20 8 12 16 12 24C12 28 16 32 20 32C24 32 28 28 28 24C28 16 20 8 20 8Z"
            fill={COLORS.terracotta}
          />
          {/* Inner accent line */}
          <Path
            d="M20 12C20 12 16 18 16 24C16 26 18 28 20 28C22 28 24 26 24 24C24 18 20 12 20 12Z"
            fill={COLORS.gold}
          />
          {/* Center glow point */}
          <Circle cx="20" cy="22" r="3" fill={COLORS.cream} />
        </Svg>
      </View>

      {showText && (
        <View>
          <Text
            variant="h2"
            style={{ textTransform: "lowercase" }}
          >
            alora
          </Text>
        </View>
      )}
    </View>
  );
}

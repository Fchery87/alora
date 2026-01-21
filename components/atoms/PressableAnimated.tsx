import { Pressable } from "react-native";
import { MotiView } from "moti";

interface PressableAnimatedProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  delay?: number;
}

export function PressableAnimated({
  children,
  onPress,
  disabled = false,
  delay = 0,
}: PressableAnimatedProps) {
  return (
    <MotiView
      from={{ opacity: 0.8, scale: 0.95 }}
      animate={{
        opacity: disabled ? 0.5 : 1,
        scale: disabled ? 0.95 : 1,
      }}
      transition={{
        type: "spring",
        delay,
      }}
    >
      <Pressable onPress={onPress} disabled={disabled}>
        {children}
      </Pressable>
    </MotiView>
  );
}

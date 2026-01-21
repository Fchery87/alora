import { Text, View, StyleSheet, Pressable } from "react-native";
import { MotiView } from "moti";

interface LoadingButtonProps {
  loading: boolean;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function LoadingButton({
  loading,
  onPress,
  children,
  disabled = false,
}: LoadingButtonProps) {
  return (
    <MotiView
      from={{ opacity: 0.7, scale: 0.95 }}
      animate={{
        opacity: loading ? 0.5 : disabled ? 0.5 : 1,
        scale: loading ? 0.95 : disabled ? 0.95 : 1,
      }}
      transition={{ type: "spring" }}
    >
      <Pressable onPress={onPress} disabled={loading || disabled}>
        <View style={[styles.container, disabled && styles.disabled]}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.text}>{children}</Text>
          )}
        </View>
      </Pressable>
    </MotiView>
  );
}

interface ActivityIndicatorProps {
  size?: "small" | "large";
  color?: string;
}

export function ActivityIndicator({
  size = "small",
  color = "#6366f1",
}: ActivityIndicatorProps) {
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

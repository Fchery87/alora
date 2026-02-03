import { View, StyleSheet } from "react-native";

export function TextSkeleton({
  width,
  height,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <View
      style={[
        styles.skeleton,
        width ? { width } : undefined,
        height ? { height } : undefined,
        className ? styles[className as keyof typeof styles] : undefined,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <TextSkeleton height={20} width={60} />
      <TextSkeleton height={16} width={100} />
      <View style={styles.skeletonContent}>
        <TextSkeleton height={12} width={80} />
        <TextSkeleton height={12} width={60} />
        <TextSkeleton height={12} width={70} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardSkeleton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 8,
  },
  skeletonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

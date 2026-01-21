import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FooterProps {
  children: React.ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

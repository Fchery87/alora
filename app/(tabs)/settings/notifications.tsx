import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NotificationSettings } from "@/components/organisms/NotificationSettings";

export default function SettingsNotificationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <NotificationSettings babyId="demo-baby-id" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});

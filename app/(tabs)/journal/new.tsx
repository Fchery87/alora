import { View, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { JournalEntryForm } from "@/components/organisms/JournalEntryForm";

export default function NewJournalEntryScreen() {
  return (
    <View style={styles.screen}>
      <Header title="New Entry" showBackButton />
      <JournalEntryForm />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

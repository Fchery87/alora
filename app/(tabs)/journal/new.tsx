import { View, StyleSheet, ScrollView } from "react-native";
import { Header } from "@/components/layout/Header";
import { JournalEntryForm } from "@/components/organisms/JournalEntryForm";
import { BACKGROUND } from "@/lib/theme";

export default function NewJournalEntryScreen() {
  return (
    <View style={styles.screen}>
      <Header title="New Entry" showBackButton />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <JournalEntryForm />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  content: {
    flex: 1,
  },
});

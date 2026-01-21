import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Header } from "@/components/layout/Header";
import { JournalEntryForm } from "@/components/organisms/JournalEntryForm";

export default function NewJournalEntryScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="New Entry" showBackButton />
      <JournalEntryForm />
    </View>
  );
}

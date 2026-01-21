import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [editing, setEditing] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            }}
            style={styles.avatarImage}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.avatarLabel}>Tap to change photo</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.fieldValue}>{name}</Text>
            )}
          </View>

          <View style={[styles.field, styles.fieldBorder]}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{email}</Text>
          </View>

          <View style={[styles.field, styles.fieldBorder]}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <Text style={styles.fieldValue}>+1 (555) 123-4567</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <Ionicons
            name={editing ? "checkmark-outline" : "create-outline"}
            size={20}
            color="#fff"
          />
          <Text style={styles.editButtonText}>
            {editing ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Members</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.memberItem}>
            <View style={[styles.memberAvatar, { backgroundColor: "#fde047" }]}>
              <Text style={styles.memberInitial}>J</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>John Doe</Text>
              <Text style={styles.memberRole}>Parent</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.memberItem, styles.memberItemBorder]}
          >
            <View style={[styles.memberAvatar, { backgroundColor: "#f472b6" }]}>
              <Text style={styles.memberInitial}>M</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Mary Doe</Text>
              <Text style={styles.memberRole}>Parent</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add-outline" size={20} color="#6366f1" />
          <Text style={styles.addButtonText}>Add Family Member</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Babies</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.babyItem}>
            <View style={styles.babyAvatar}>
              <Ionicons name="happy-outline" size={32} color="#6366f1" />
            </View>
            <View style={styles.babyInfo}>
              <Text style={styles.babyName}>Baby Doe</Text>
              <Text style={styles.babyAge}>6 months old</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
          <Text style={styles.addButtonText}>Add Baby</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6366f1",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  field: {
    padding: 16,
  },
  fieldBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  fieldLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#0f172a",
  },
  fieldInput: {
    fontSize: 16,
    color: "#0f172a",
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#6366f1",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  memberItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  memberRole: {
    fontSize: 13,
    color: "#6b7280",
  },
  babyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  babyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  babyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  babyName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  babyAge: {
    fontSize: 13,
    color: "#6b7280",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
  },
});

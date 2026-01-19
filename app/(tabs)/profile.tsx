import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleSignOut = async () => {
    await signOut();
    return <Redirect href="/(auth)/login" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.firstName?.[0] ||
              user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
              "?"}
          </Text>
        </View>
        <Text style={styles.name}>
          {user.fullName || user.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Email</Text>
          <Text style={styles.itemValue}>
            {user.emailAddresses[0]?.emailAddress}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  item: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 14,
    color: "#6b7280",
  },
  button: {
    padding: 16,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

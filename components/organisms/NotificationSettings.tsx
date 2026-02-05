import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useNotificationReminders } from "@/hooks/notifications/useNotificationReminders";
import { NotificationReminderItem } from "@/components/molecules/notifications/NotificationReminder";
import { NotificationReminder } from "@/lib/notifications";
import { BACKGROUND, COLORS } from "@/lib/theme";

interface NotificationSettingsProps {
  babyId: string;
}

export function NotificationSettings({ babyId }: NotificationSettingsProps) {
  const { expoPushToken, isEnabled, requestPermissions } = useNotifications();
  const {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
  } = useNotificationReminders(babyId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState<NotificationReminder | null>(null);
  const [newReminder, setNewReminder] = useState({
    type: "feeding" as "feeding" | "sleep" | "diaper" | "custom",
    title: "",
    message: "",
    intervalMinutes: 180,
    specificTime: "",
  });

  const handleAddReminder = async () => {
    await addReminder({
      babyId,
      type: newReminder.type,
      title: newReminder.title,
      message: newReminder.message || undefined,
      intervalMinutes:
        newReminder.type !== "sleep" ? newReminder.intervalMinutes : undefined,
      specificTime:
        newReminder.type === "sleep" ? newReminder.specificTime : undefined,
      isEnabled: true,
    });
    setShowAddModal(false);
    setNewReminder({
      type: "feeding",
      title: "",
      message: "",
      intervalMinutes: 180,
      specificTime: "",
    });
  };

  const handleEditReminder = async () => {
    if (editingReminder) {
      await updateReminder(editingReminder.id, editingReminder);
      setShowEditModal(false);
      setEditingReminder(null);
    }
  };

  const openEditModal = (reminder: NotificationReminder) => {
    setEditingReminder({ ...reminder });
    setShowEditModal(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.permissionCard}>
        <View style={styles.permissionHeader}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.terracotta}
          />
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>Push Notifications</Text>
            <Text style={styles.permissionStatus}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={async () => {
              if (!isEnabled) {
                await requestPermissions();
              }
            }}
            trackColor={{ false: BACKGROUND.tertiary, true: COLORS.sage }}
            thumbColor="#fff"
          />
        </View>

        {!isEnabled && (
          <TouchableOpacity
            style={styles.enableButton}
            onPress={requestPermissions}
          >
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          </TouchableOpacity>
        )}

        {expoPushToken && (
          <Text style={styles.tokenInfo}>
            Device token: {expoPushToken.slice(0, 20)}...
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reminder Schedule</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading reminders...</Text>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#d1d5db"
            />
            <Text style={styles.emptyText}>No reminders set up</Text>
            <Text style={styles.emptySubtext}>
              Add reminders to help track your baby
            </Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <NotificationReminderItem
              key={reminder.id}
              reminder={reminder}
              onToggle={toggleReminder}
              onEdit={openEditModal}
              onDelete={deleteReminder}
            />
          ))
        )}
      </View>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Reminder</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeRow}>
                  {["feeding", "sleep", "diaper", "custom"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newReminder.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() =>
                        setNewReminder({ ...newReminder, type: type as any })
                      }
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newReminder.type === type &&
                            styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Reminder title"
                  value={newReminder.title}
                  onChangeText={(text) =>
                    setNewReminder({ ...newReminder, title: text })
                  }
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Message (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Reminder message"
                  value={newReminder.message}
                  onChangeText={(text) =>
                    setNewReminder({ ...newReminder, message: text })
                  }
                  multiline
                />
              </View>

              {newReminder.type === "sleep" ? (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM (e.g., 19:00)"
                    value={newReminder.specificTime}
                    onChangeText={(text) =>
                      setNewReminder({ ...newReminder, specificTime: text })
                    }
                  />
                </View>
              ) : (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Interval (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="180"
                    value={String(newReminder.intervalMinutes)}
                    onChangeText={(text) =>
                      setNewReminder({
                        ...newReminder,
                        intervalMinutes: parseInt(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                  />
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !newReminder.title && styles.submitButtonDisabled,
                ]}
                onPress={handleAddReminder}
                disabled={!newReminder.title}
              >
                <Text style={styles.submitButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Reminder</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setEditingReminder(null);
                }}
              >
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {editingReminder && (
                <>
                  <View style={styles.formSection}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                      style={styles.input}
                      value={editingReminder.title}
                      onChangeText={(text) =>
                        setEditingReminder({ ...editingReminder, title: text })
                      }
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editingReminder.message || ""}
                      onChangeText={(text) =>
                        setEditingReminder({
                          ...editingReminder,
                          message: text,
                        })
                      }
                      multiline
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleEditReminder}
                  >
                    <Text style={styles.submitButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  permissionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  permissionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  permissionStatus: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  enableButton: {
    backgroundColor: COLORS.terracotta,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  enableButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tokenInfo: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 8,
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  modalForm: {
    padding: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeButton: {
    flex: 1,
    minWidth: "22%",
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: COLORS.terracotta,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: COLORS.terracotta,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

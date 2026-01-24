import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  scheduleReminderNotification,
  cancelNotification,
  NotificationReminder,
} from "@/lib/notifications";

export function useNotificationReminders(babyId: string) {
  const [reminders, setReminders] = useState<NotificationReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(`reminders_${babyId}`);
      if (stored) {
        setReminders(JSON.parse(stored));
      } else {
        const defaults = getDefaultReminders(babyId);
        setReminders(defaults);
        await AsyncStorage.setItem(
          `reminders_${babyId}`,
          JSON.stringify(defaults)
        );
      }
    } catch (error) {
      console.error("Failed to load reminders:", error);
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const saveReminders = useCallback(
    async (newReminders: NotificationReminder[]) => {
      setReminders(newReminders);
      await AsyncStorage.setItem(
        `reminders_${babyId}`,
        JSON.stringify(newReminders)
      );
    },
    [babyId]
  );

  const addReminder = useCallback(
    async (reminder: Omit<NotificationReminder, "id">) => {
      const newReminder: NotificationReminder = {
        ...reminder,
        id: `reminder_${Date.now()}`,
      };
      if (newReminder.isEnabled) {
        const notificationId = await scheduleReminderNotification(newReminder);
        if (notificationId) {
          newReminder.notificationId = notificationId;
        }
      }
      const newReminders = [...reminders, newReminder];
      await saveReminders(newReminders);

      return newReminder;
    },
    [reminders, saveReminders]
  );

  const updateReminder = useCallback(
    async (id: string, updates: Partial<NotificationReminder>) => {
      const newReminders = reminders.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      );
      const updated = newReminders.find((r) => r.id === id);
      if (updated?.notificationId) {
        await cancelNotification(updated.notificationId);
      }
      if (updated?.isEnabled) {
        const notificationId = await scheduleReminderNotification(updated);
        updated.notificationId = notificationId ?? undefined;
      } else if (updated) {
        updated.notificationId = undefined;
      }
      await saveReminders([...newReminders]);
    },
    [reminders, saveReminders]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder?.notificationId) {
        await cancelNotification(reminder.notificationId);
      }
      const newReminders = reminders.filter((r) => r.id !== id);
      await saveReminders(newReminders);
    },
    [reminders, saveReminders]
  );

  const toggleReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder) {
        await updateReminder(id, { isEnabled: !reminder.isEnabled });
      }
    },
    [reminders, updateReminder]
  );

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    refresh: loadReminders,
  };
}

function getDefaultReminders(babyId: string): NotificationReminder[] {
  return [
    {
      id: "default_feeding",
      babyId,
      type: "feeding",
      title: "Feeding Time",
      message: "It's been a while since the last feeding",
      intervalMinutes: 180,
      isEnabled: true,
    },
    {
      id: "default_sleep",
      babyId,
      type: "sleep",
      title: "Sleep Reminder",
      message: "Watch for sleepy cues",
      specificTime: "19:00",
      isEnabled: true,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: "default_diaper",
      babyId,
      type: "diaper",
      title: "Diaper Check",
      message: "Time to check if a diaper change is needed",
      intervalMinutes: 120,
      isEnabled: false,
    },
    // Self-care reminders - gentle nudges for parent well-being
    {
      id: "default_hydration",
      babyId,
      type: "self-care",
      title: "Hydration Reminder",
      message:
        "Don't forget to hydrate. A glass of water can make a big difference.",
      intervalMinutes: 120,
      isEnabled: true,
    },
    {
      id: "default_rest",
      babyId,
      type: "self-care",
      title: "Rest Reminder",
      message:
        "It's been a while since you logged any rest. Have you had a moment to yourself today?",
      intervalMinutes: 240,
      isEnabled: true,
    },
    {
      id: "default_nutrition",
      babyId,
      type: "self-care",
      title: "Nutrition Check",
      message: "Don't forget to hydrate and eat something nourishing.",
      intervalMinutes: 180,
      isEnabled: false,
    },
    {
      id: "default_mindfulness",
      babyId,
      type: "self-care",
      title: "Mindfulness Moment",
      message: "Take a deep breath. You're doing amazing.",
      specificTime: "12:00",
      isEnabled: false,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    // Daily affirmation - supportive message each day
    {
      id: "daily_affirmation",
      babyId,
      type: "affirmation",
      title: "Daily Affirmation",
      message: "You are enough, exactly as you are.",
      specificTime: "09:00",
      isEnabled: true,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
  ];
}

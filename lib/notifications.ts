import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { getRandomSelfCareNudge, getDailyAffirmation } from "./self-care";

export interface NotificationReminder {
  id: string;
  babyId: string;
  type: "feeding" | "sleep" | "diaper" | "custom" | "self-care" | "affirmation";
  title: string;
  message?: string;
  intervalMinutes?: number;
  specificTime?: string;
  isEnabled: boolean;
  daysOfWeek?: number[];
  notificationId?: string;
}

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6366f1",
    });

    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22c55e",
    });

    await Notifications.setNotificationChannelAsync("celebrations", {
      name: "Celebrations",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 200, 300],
      lightColor: "#f59e0b",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.easConfig?.projectId ||
    (Constants.expoConfig as any)?.extra?.eas?.projectId ||
    process.env.EXPO_PROJECT_ID ||
    process.env.EXPO_PUBLIC_EXPO_PROJECT_ID ||
    "your-project-id";

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenData.data;
}

export async function scheduleReminderNotification(
  reminder: NotificationReminder
): Promise<string | null> {
  if (!reminder.isEnabled) return null;

  let trigger: Notifications.NotificationTrigger | null = null;

  if (reminder.intervalMinutes) {
    trigger = {
      type: "timeInterval",
      seconds: reminder.intervalMinutes * 60,
      repeats: true,
    } as unknown as Notifications.TimeIntervalNotificationTrigger;
  } else if (reminder.specificTime) {
    const [hours, minutes] = reminder.specificTime.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    trigger = {
      type: "daily",
      hour: hours,
      minute: minutes,
    };
  }

  if (!trigger) return null;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.message || getDefaultMessage(reminder.type),
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });

  return notificationId;
}

export async function cancelNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getPendingNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

function getDefaultMessage(type: NotificationReminder["type"]): string {
  switch (type) {
    case "feeding":
      return "Time to feed your baby!";
    case "sleep":
      return "Nap time reminder";
    case "diaper":
      return "Time for a diaper change";
    case "custom":
      return "Reminder";
    case "self-care":
      return getRandomSelfCareNudge().message;
    case "affirmation":
      return getDailyAffirmation().message;
    default:
      return "Reminder";
  }
}

export const DEFAULT_REMINDERS: Omit<NotificationReminder, "id" | "babyId">[] =
  [
    {
      type: "feeding",
      title: "Feeding Time",
      message: "It's been a while since the last feeding",
      intervalMinutes: 180,
      isEnabled: true,
    },
    {
      type: "sleep",
      title: "Sleep Reminder",
      message: "Watch for sleepy cues",
      specificTime: "19:00",
      isEnabled: true,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      type: "diaper",
      title: "Diaper Check",
      message: "Time to check if a diaper change is needed",
      intervalMinutes: 120,
      isEnabled: false,
    },
  ];

import { useState, useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/lib/notifications";

export interface ExpoPushToken {
  data: string;
  type: "expo";
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] =
    useState<Notifications.PermissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
      })
      .catch((err) => {
        setError(err.message);
      });

    Notifications.getPermissionsAsync()
      .then((status) => {
        setNotificationStatus(status.status);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationStatus(status);
      if (status !== "granted") {
        setError("Notification permissions denied");
      }
      return status;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      return token;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    expoPushToken,
    notificationStatus,
    error,
    isEnabled: notificationStatus === "granted",
    requestPermissions,
    refreshToken,
  };
}

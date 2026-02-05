import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isExpoGo, registerForPushNotificationsAsync } from "@/lib/notifications";

export function usePushSync(enabled: boolean) {
  const upsertToken = useMutation(api.functions.push.index.upsertExpoPushToken);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    if (!enabled) return;

    setIsRegistering(true);
    void (async () => {
      try {
        const t = await registerForPushNotificationsAsync();
        if (cancelled) return;
        if (!t) {
          setError(
            isExpoGo()
              ? "Push notifications aren’t supported in Expo Go. Use a development build to test push notifications."
              : "Notifications permission not granted."
          );
          setToken(null);
          return;
        }
        setToken(t);
        await upsertToken({ expoPushToken: t, platform: Platform.OS });
      } catch (e: any) {
        if (!cancelled)
          setError(e?.message || "Failed to register for push notifications.");
      } finally {
        if (!cancelled) setIsRegistering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, upsertToken]);

  return { token, error, isRegistering };
}

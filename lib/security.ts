import { SessionLockManager } from "./session-lock";
import * as LocalAuthentication from "expo-local-authentication";
import { AppState, AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";

const ENCRYPTION_KEY = "alora-encryption-key";

export class SecurityManager {
  private static lockTimer: NodeJS.Timeout | null = null;

  static async clearOnLogout(): Promise<void> {
    await SessionLockManager.lock();
  }

  static async verifyUser(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access journal",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      await SessionLockManager.unlock();
    }

    return result.success;
  }

  static setupAutoLock(): void {
    let lastActiveTime = Date.now();

    if (this.lockTimer) {
      clearInterval(this.lockTimer);
    }

    this.lockTimer = setInterval(() => {
      if (Date.now() - lastActiveTime > 5 * 60 * 1000) {
        this.lockApp();
      }
    }, 60000);

    AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        lastActiveTime = Date.now();
      }
    });
  }

  private static lockApp(): void {
    SessionLockManager.lock();
  }

  static async verifyEncryptionKey(): Promise<boolean> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
      return key !== null;
    } catch {
      return false;
    }
  }
}

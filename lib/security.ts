import { SessionLockManager } from "./session-lock";
import * as LocalAuthentication from "expo-local-authentication";
import { AppState, AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";

const ENCRYPTION_KEY = "alora-encryption-key";

export class SecurityManager {
  private static lockTimer: ReturnType<typeof setInterval> | null = null;
  private static appStateSubscription:
    | { remove: () => void }
    | null = null;

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

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }

    this.appStateSubscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          lastActiveTime = Date.now();
        }
      }
    );
  }

  private static lockApp(): void {
    SessionLockManager.lock();
  }

  static teardownAutoLock(): void {
    if (this.lockTimer) {
      clearInterval(this.lockTimer);
      this.lockTimer = null;
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
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

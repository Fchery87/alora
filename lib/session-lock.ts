import * as SecureStore from "expo-secure-store";

const SESSION_LOCK_KEY = "alora-session-locked";

export class SessionLockManager {
  private static isLocked: boolean = false;

  static async lock(): Promise<void> {
    this.isLocked = true;
    await SecureStore.setItemAsync(SESSION_LOCK_KEY, "true");
  }

  static async unlock(): Promise<void> {
    this.isLocked = false;
    await SecureStore.deleteItemAsync(SESSION_LOCK_KEY);
  }

  static async isSessionLocked(): Promise<boolean> {
    try {
      const locked = await SecureStore.getItemAsync(SESSION_LOCK_KEY);
      return locked === "true";
    } catch {
      return false;
    }
  }

  static get isCurrentlyLocked(): boolean {
    return this.isLocked;
  }
}

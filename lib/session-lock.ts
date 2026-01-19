import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_LOCK_KEY = "alora-session-locked";

export class SessionLockManager {
  private static isLocked: boolean = false;

  static async lock(): Promise<void> {
    this.isLocked = true;
    await AsyncStorage.setItem(SESSION_LOCK_KEY, "true");
  }

  static async unlock(): Promise<void> {
    this.isLocked = false;
    await AsyncStorage.removeItem(SESSION_LOCK_KEY);
  }

  static async isSessionLocked(): Promise<boolean> {
    try {
      const locked = await AsyncStorage.getItem(SESSION_LOCK_KEY);
      return locked === "true";
    } catch {
      return false;
    }
  }

  static get isCurrentlyLocked(): boolean {
    return this.isLocked;
  }
}

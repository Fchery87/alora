import * as SecureStore from "expo-secure-store";

interface TokenCache {
  getToken(key: string): Promise<string | null | undefined>;
  saveToken(key: string, token: string): Promise<void>;
  clearToken(key: string): Promise<void>;
}

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch {
      // Ignore errors
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore errors
    }
  },
};

import AsyncStorage from "@react-native-async-storage/async-storage";

const CHUNK_SIZE = 1800;

class LargeSecureStore {
  private async deleteAllKeys(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const dataKeys = keys.filter((k) => k.startsWith("_secure_store_"));
    await AsyncStorage.multiRemove(dataKeys);
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const indexStr = await AsyncStorage.getItem(`_secure_index_${key}`);
      if (!indexStr) return null;

      const index = parseInt(indexStr, 10);
      const chunks: string[] = [];

      for (let i = 0; i < index; i++) {
        const chunk = await AsyncStorage.getItem(`_secure_store_${key}_${i}`);
        if (chunk) chunks.push(chunk);
      }

      return chunks.join("");
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, "g")) || [];

    await AsyncStorage.setItem(
      `_secure_index_${key}`,
      chunks.length.toString()
    );

    for (let i = 0; i < chunks.length; i++) {
      await AsyncStorage.setItem(`_secure_store_${key}_${i}`, chunks[i]);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const indexStr = await AsyncStorage.getItem(`_secure_index_${key}`);
      if (indexStr) {
        const index = parseInt(indexStr, 10);
        for (let i = 0; i < index; i++) {
          await AsyncStorage.removeItem(`_secure_store_${key}_${i}`);
        }
      }
      await AsyncStorage.removeItem(`_secure_index_${key}`);
    } catch {
      // Key didn't exist
    }
  }

  async clear(): Promise<void> {
    await this.deleteAllKeys();
  }
}

export const secureStorage = new LargeSecureStore();

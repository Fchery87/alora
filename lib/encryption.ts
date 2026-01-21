type AsyncStorageType = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
};

const ENCRYPTION_KEY = "alora-encryption-key";

async function getSecureStore() {
  const injected = (globalThis as any).__ALORA_SECURE_STORE__;
  if (injected) {
    return injected;
  }
  try {
    return await import("expo-secure-store");
  } catch {
    return {
      getItemAsync: async () => null,
      setItemAsync: async () => undefined,
      deleteItemAsync: async () => undefined,
    };
  }
}

async function getCrypto() {
  const injected = (globalThis as any).__ALORA_CRYPTO__;
  if (injected) {
    return injected;
  }
  return await import("expo-crypto");
}

async function getAsyncStorage(): Promise<AsyncStorageType> {
  const injected = (globalThis as any).__ALORA_ASYNC_STORAGE__;
  if (injected) {
    return injected;
  }
  const module = await import("@react-native-async-storage/async-storage");
  return module.default;
}

export class LargeSecureStore {
  private async getEncryptionKey(): Promise<string> {
    const SecureStore = await getSecureStore();
    let keyHex: string | null = await SecureStore.getItemAsync(ENCRYPTION_KEY);

    if (!keyHex) {
      const Crypto = await getCrypto();
      const keyBytes = await Crypto.getRandomBytesAsync(32);
      keyHex = Array.from(keyBytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      await SecureStore.setItemAsync(ENCRYPTION_KEY, keyHex);
    }

    return keyHex;
  }

  async encrypt(plaintext: string): Promise<string> {
    const keyHex = await this.getEncryptionKey();
    const Crypto = await getCrypto();
    const ivBytes = await Crypto.getRandomBytesAsync(12);
    const ivHex = Array.from(ivBytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    const encrypted = await Crypto.encryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      plaintext,
      keyHex,
      { iv: ivHex }
    );

    return JSON.stringify({
      iv: ivHex,
      data: encrypted,
    });
  }

  async decrypt(ciphertext: string): Promise<string> {
    const keyHex = await this.getEncryptionKey();
    const parsed = JSON.parse(ciphertext);

    const Crypto = await getCrypto();
    return await Crypto.decryptAsync(
      Crypto.CryptoEncryptedEncoding.UTF8,
      parsed.data,
      keyHex,
      { iv: parsed.iv }
    );
  }

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(value);
    const AsyncStorage = await getAsyncStorage();
    await AsyncStorage.setItem(key, encrypted);
  }

  async getItem(key: string): Promise<string | null> {
    const AsyncStorage = await getAsyncStorage();
    const encrypted = await AsyncStorage.getItem(key);

    if (!encrypted) {
      return null;
    }

    try {
      return await this.decrypt(encrypted);
    } catch {
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    const AsyncStorage = await getAsyncStorage();
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    const SecureStore = await getSecureStore();
    await SecureStore.deleteItemAsync(ENCRYPTION_KEY);
  }
}

export const secureStorage = new LargeSecureStore();

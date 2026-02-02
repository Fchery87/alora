import AES from "crypto-js/aes";
import HmacSHA256 from "crypto-js/hmac-sha256";
import CryptoJS from "crypto-js";

type AsyncStorageType = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
};

const ENCRYPTION_KEY = "alora-encryption-key";
const CBC_IV_LENGTH = 16; // Standard 16-byte IV for AES-CBC

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

/**
 * Derive encryption and authentication keys from the master key using HKDF-like approach.
 * This ensures that even if one key is compromised, the other remains secure.
 */
function deriveKeys(masterKey: CryptoJS.lib.WordArray): {
  encryptionKey: CryptoJS.lib.WordArray;
  authKey: CryptoJS.lib.WordArray;
} {
  // Use HKDF-like key derivation: first 32 bytes for encryption, last 32 bytes for auth
  // We'll use HMAC-SHA256 to derive the keys
  const info = CryptoJS.enc.Utf8.parse("alora-encryption-keys");

  // Derive encryption key
  const encryptionKey = HmacSHA256(info, masterKey);

  // Derive authentication key (use different info)
  const authInfo = CryptoJS.enc.Utf8.parse("alora-auth-keys");
  const authKey = HmacSHA256(authInfo, masterKey);

  return { encryptionKey, authKey };
}

export class LargeSecureStore {
  private async getEncryptionKey(): Promise<CryptoJS.lib.WordArray> {
    const SecureStore = await getSecureStore();
    let keyHex: string | null = await SecureStore.getItemAsync(ENCRYPTION_KEY);

    if (!keyHex) {
      const Crypto = await getCrypto();
      const keyBytes = await Crypto.getRandomBytesAsync(32); // 256-bit master key
      keyHex = Array.from(keyBytes as Uint8Array)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      await SecureStore.setItemAsync(ENCRYPTION_KEY, keyHex);
    }

    // Convert hex string to CryptoJS WordArray
    return CryptoJS.enc.Hex.parse(keyHex);
  }

  /**
   * Encrypt plaintext using AES-256-CBC with HMAC-SHA256 authentication (Encrypt-then-MAC).
   * This provides authenticated encryption that can detect tampering.
   */
  async encrypt(plaintext: string): Promise<string> {
    const masterKey = await this.getEncryptionKey();
    const Crypto = await getCrypto();

    // Derive encryption and authentication keys
    const { encryptionKey, authKey } = deriveKeys(masterKey);

    // Generate random 16-byte IV for CBC mode
    const ivBytes = await Crypto.getRandomBytesAsync(CBC_IV_LENGTH);
    const ivHex = Array.from(ivBytes as Uint8Array)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    // Encrypt using AES-256-CBC
    const encrypted = AES.encrypt(plaintext, encryptionKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Calculate HMAC-SHA256 over the IV and ciphertext (Encrypt-then-MAC)
    const ciphertext = encrypted.toString();
    const dataToAuthenticate = `${ivHex}:${ciphertext}`;
    const mac = HmacSHA256(dataToAuthenticate, authKey).toString();

    // Return structure with IV, ciphertext, and MAC
    return JSON.stringify({
      iv: ivHex,
      data: ciphertext,
      mac,
    });
  }

  /**
   * Decrypt ciphertext and verify HMAC-SHA256 authentication (Decrypt-then-MAC is vulnerable,
   * so we use Verify-then-Decrypt).
   * Throws an error if authentication fails (tampering detected).
   */
  async decrypt(ciphertext: string): Promise<string> {
    const masterKey = await this.getEncryptionKey();
    const parsed = JSON.parse(ciphertext);

    // Derive encryption and authentication keys
    const { encryptionKey, authKey } = deriveKeys(masterKey);

    // Convert hex string to CryptoJS WordArray for IV
    const iv = CryptoJS.enc.Hex.parse(parsed.iv);

    try {
      // Verify MAC first (Verify-then-Decrypt to prevent oracle attacks)
      const dataToAuthenticate = `${parsed.iv}:${parsed.data}`;
      const calculatedMac = HmacSHA256(dataToAuthenticate, authKey).toString();

      if (calculatedMac !== parsed.mac) {
        throw new Error(
          "Authentication failed: MAC mismatch - data may have been tampered with"
        );
      }

      // Decrypt using AES-256-CBC
      const decrypted = AES.decrypt(parsed.data, encryptionKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Convert to UTF-8 string
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      // Validate that decryption succeeded
      if (!plaintext) {
        throw new Error("Decryption failed: invalid ciphertext");
      }

      return plaintext;
    } catch (error) {
      // Handle decryption failures gracefully
      if (
        error instanceof Error &&
        error.message.includes("Authentication failed")
      ) {
        throw error; // Re-throw authentication errors
      }
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
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
      // Return null on decryption failure (could be tampered data)
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

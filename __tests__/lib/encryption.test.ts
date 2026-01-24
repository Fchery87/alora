import { describe, it, expect, beforeEach, vi } from "vitest";

let LargeSecureStore: typeof import("../../lib/encryption").LargeSecureStore;
const SecureStoreMock = {
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
};
const CryptoMock = {
  getRandomBytesAsync: vi.fn(),
};
const AsyncStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.mock("expo-crypto", () => ({
  __esModule: true,
  getRandomBytesAsync: vi.fn(),
}));

vi.mock("expo-secure-store", () => ({
  __esModule: true,
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("LargeSecureStore Encryption", () => {
  let store: InstanceType<typeof LargeSecureStore>;

  beforeEach(async () => {
    vi.clearAllMocks();
    (globalThis as any).__ALORA_SECURE_STORE__ = SecureStoreMock;
    (globalThis as any).__ALORA_CRYPTO__ = CryptoMock;
    (globalThis as any).__ALORA_ASYNC_STORAGE__ = AsyncStorageMock;
    // Note: We don't use vi.resetModules() in vitest as it's not available
    // Instead, we dynamically import the module in each test suite setup
    ({ LargeSecureStore } = await import("../../lib/encryption"));
    store = new LargeSecureStore();
  });

  describe("getEncryptionKey", () => {
    it("should return existing key if stored", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );

      const key = await (store as any).getEncryptionKey();

      expect(key).toBeDefined();
      expect(SecureStoreMock.setItemAsync).not.toHaveBeenCalled();
    });

    it("should generate and store new key if not exists", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(null);
      // Generate 32 random bytes for the key
      const keyBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        keyBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(keyBytes);

      const key = await (store as any).getEncryptionKey();

      expect(key).toBeDefined();
      expect(SecureStoreMock.setItemAsync).toHaveBeenCalledWith(
        "alora-encryption-key",
        expect.any(String)
      );
    });
  });

  describe("encrypt", () => {
    it("should encrypt plaintext and return JSON string with IV and MAC", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );
      // Generate 16 random bytes for IV (CBC mode)
      const ivBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(ivBytes);

      const result = await store.encrypt("test plaintext");

      expect(result).toBeDefined();
      const parsed = JSON.parse(result);
      expect(parsed.iv).toBeDefined();
      expect(parsed.iv.length).toBe(32); // 16 bytes = 32 hex characters
      expect(parsed.data).toBeDefined();
      expect(typeof parsed.data).toBe("string");
      expect(parsed.mac).toBeDefined();
      expect(typeof parsed.mac).toBe("string");
    });

    it("should generate different IV and MAC on each encryption", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );
      // Generate different IVs
      const ivBytes1 = new Uint8Array(16);
      const ivBytes2 = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes1[i] = Math.floor(Math.random() * 256);
        ivBytes2[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync
        .mockResolvedValueOnce(ivBytes1)
        .mockResolvedValueOnce(ivBytes2);

      const result1 = await store.encrypt("test plaintext");
      const result2 = await store.encrypt("test plaintext");

      const parsed1 = JSON.parse(result1);
      const parsed2 = JSON.parse(result2);

      expect(parsed1.iv).not.toBe(parsed2.iv);
      expect(parsed1.data).not.toBe(parsed2.data);
      expect(parsed1.mac).not.toBe(parsed2.mac);
    });
  });

  describe("decrypt", () => {
    it("should decrypt ciphertext and return plaintext", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );
      // Generate IV for encryption
      const ivBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(ivBytes);

      const plaintext = "test plaintext";
      const encrypted = await store.encrypt(plaintext);
      const decrypted = await store.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it("should detect and reject tampered ciphertext (wrong MAC)", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );

      const tamperedCiphertext = JSON.stringify({
        iv: "0102030405060708090a0b0c0d0e0f10",
        data: "tampered-data",
        mac: "wrong-mac-that-will-not-validate",
      });

      await expect(store.decrypt(tamperedCiphertext)).rejects.toThrow(
        "Authentication failed"
      );
    });

    it("should detect and reject ciphertext with tampered data", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );
      // Generate IV for encryption
      const ivBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(ivBytes);

      // Encrypt some data
      const plaintext = "test plaintext";
      const encrypted = await store.encrypt(plaintext);
      const parsed = JSON.parse(encrypted);

      // Tamper with the data but keep the original MAC
      const tampered = JSON.stringify({
        iv: parsed.iv,
        data: "different-encrypted-data",
        mac: parsed.mac,
      });

      await expect(store.decrypt(tampered)).rejects.toThrow(
        "Authentication failed"
      );
    });
  });

  describe("setItem", () => {
    it("should encrypt and store value", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );
      // Generate IV
      const ivBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(ivBytes);

      await store.setItem("test-key", "test-value");

      expect(AsyncStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        expect.any(String)
      );

      // Verify the stored value is encrypted JSON with IV, data, and MAC
      const storedValue = AsyncStorageMock.setItem.mock.calls[0][1];
      const parsed = JSON.parse(storedValue);
      expect(parsed.iv).toBeDefined();
      expect(parsed.data).toBeDefined();
      expect(parsed.mac).toBeDefined();
    });
  });

  describe("getItem", () => {
    it("should retrieve and decrypt value", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );

      // First encrypt a value
      const ivBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        ivBytes[i] = Math.floor(Math.random() * 256);
      }
      CryptoMock.getRandomBytesAsync.mockResolvedValue(ivBytes);

      const encrypted = await store.encrypt("test-value");
      AsyncStorageMock.getItem.mockResolvedValue(encrypted);

      const result = await store.getItem("test-key");

      expect(result).toBe("test-value");
    });

    it("should return null if no value found", async () => {
      AsyncStorageMock.getItem.mockResolvedValue(null);

      const result = await store.getItem("non-existent-key");

      expect(result).toBeNull();
    });

    it("should return null if decryption fails (tampered data)", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
      );

      const tamperedCiphertext = JSON.stringify({
        iv: "0102030405060708090a0b0c0d0e0f10",
        data: "corrupted-encrypted-data",
        mac: "wrong-mac",
      });
      AsyncStorageMock.getItem.mockResolvedValue(tamperedCiphertext);

      const result = await store.getItem("test-key");

      // Should return null when decryption fails (tampering detection)
      expect(result).toBeNull();
    });
  });

  describe("clear", () => {
    it("should delete encryption key", async () => {
      await store.clear();

      expect(SecureStoreMock.deleteItemAsync).toHaveBeenCalledWith(
        "alora-encryption-key"
      );
    });
  });
});

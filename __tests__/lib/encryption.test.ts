import { describe, it, expect, beforeEach, vi } from "vitest";

let LargeSecureStore: any;
const SecureStoreMock = {
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
};
const CryptoMock = {
  getRandomBytesAsync: vi.fn(),
  encryptAsync: vi.fn(),
  decryptAsync: vi.fn(),
  CryptoEncryptedEncoding: {
    UTF8: "utf8",
  },
};
const AsyncStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.mock(
  "expo-crypto",
  () => ({
    __esModule: true,
    getRandomBytesAsync: vi.fn(),
    encryptAsync: vi.fn(),
    decryptAsync: vi.fn(),
    CryptoEncryptedEncoding: {
      UTF8: "utf8",
    },
  }),
  { virtual: true }
);

vi.mock(
  "expo-secure-store",
  () => ({
    __esModule: true,
    getItemAsync: vi.fn(),
    setItemAsync: vi.fn(),
    deleteItemAsync: vi.fn(),
  }),
  { virtual: true }
);

vi.mock(
  "@react-native-async-storage/async-storage",
  () => ({
    __esModule: true,
    default: {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    },
  }),
  { virtual: true }
);

describe("LargeSecureStore Encryption", () => {
  let store: LargeSecureStore;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    (globalThis as any).__ALORA_SECURE_STORE__ = SecureStoreMock;
    (globalThis as any).__ALORA_CRYPTO__ = CryptoMock;
    (globalThis as any).__ALORA_ASYNC_STORAGE__ = AsyncStorageMock;
    ({ LargeSecureStore } = await import("../../lib/encryption"));
    store = new LargeSecureStore();
  });

  describe("getEncryptionKey", () => {
    it("should return existing key if stored", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue("existing-key");

      const key = await (store as any).getEncryptionKey();

      expect(key).toBe("existing-key");
      expect(SecureStoreMock.setItemAsync).not.toHaveBeenCalled();
    });

    it("should generate and store new key if not exists", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue(null);
      CryptoMock.getRandomBytesAsync.mockResolvedValue(new Uint8Array([1, 2, 3]));

      const key = await (store as any).getEncryptionKey();

      expect(key).toBeDefined();
      expect(SecureStoreMock.setItemAsync).toHaveBeenCalledWith(
        "alora-encryption-key",
        expect.any(String)
      );
    });
  });

  describe("encrypt", () => {
    it("should encrypt plaintext and return JSON string", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue("test-key");
      CryptoMock.getRandomBytesAsync.mockResolvedValue(new Uint8Array([1, 2, 3]));
      CryptoMock.encryptAsync.mockResolvedValue("encrypted-data");

      const result = await store.encrypt("test plaintext");

      expect(result).toBeDefined();
      const parsed = JSON.parse(result);
      expect(parsed.iv).toBeDefined();
      expect(parsed.data).toBe("encrypted-data");
    });
  });

  describe("decrypt", () => {
    it("should decrypt ciphertext and return plaintext", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue("test-key");
      CryptoMock.decryptAsync.mockResolvedValue("decrypted plaintext");

      const ciphertext = JSON.stringify({
        iv: "test-iv",
        data: "encrypted-data",
      });

      const result = await store.decrypt(ciphertext);

      expect(result).toBe("decrypted plaintext");
    });

    it("should reject tampered ciphertext", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue("test-key");
      CryptoMock.decryptAsync.mockRejectedValue(new Error("invalid tag"));

      const ciphertext = JSON.stringify({
        iv: "test-iv",
        data: "tampered-data",
      });

      await expect(store.decrypt(ciphertext)).rejects.toThrow("invalid tag");
    });

  });

  describe("setItem", () => {
    it("should encrypt and store value", async () => {
      SecureStoreMock.getItemAsync.mockResolvedValue("test-key");
      CryptoMock.getRandomBytesAsync.mockResolvedValue(new Uint8Array([1, 2, 3]));
      CryptoMock.encryptAsync.mockResolvedValue("encrypted-data");

      await store.setItem("test-key", "test-value");

      expect(AsyncStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        expect.any(String)
      );
    });
  });

  describe("getItem", () => {
    it("should retrieve and decrypt value", async () => {
      const encrypted = JSON.stringify({
        iv: "test-iv",
        data: "encrypted-data",
      });
      AsyncStorageMock.getItem.mockResolvedValue(encrypted);
      SecureStoreMock.getItemAsync.mockResolvedValue("test-key");
      CryptoMock.decryptAsync.mockResolvedValue("decrypted-value");

      const result = await store.getItem("test-key");

      expect(result).toBe("decrypted-value");
    });

    it("should return null if no value found", async () => {
      AsyncStorageMock.getItem.mockResolvedValue(null);

      const result = await store.getItem("non-existent-key");

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

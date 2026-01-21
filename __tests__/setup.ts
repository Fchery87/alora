import { vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";

globalThis.__DEV__ = true;
globalThis.React = require("react");

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ isSuccess: true, data: [], isLoading: false }),
  useMutation: (opts: any) => ({
    mutateAsync: (vars: any) => opts.mutationFn(vars),
  }),
  useQueryClient: () => ({
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  }),
}));

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
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  }),
  { virtual: true }
);

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


beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0,
};

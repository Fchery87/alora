import { vi } from "vitest";

const AsyncStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

export default AsyncStorage;

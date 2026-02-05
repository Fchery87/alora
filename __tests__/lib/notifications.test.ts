import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  isExpoGo,
  registerForPushNotificationsAsync,
} from "../../lib/notifications";

const mockIsRunningInExpoGo = vi.hoisted(() => vi.fn(() => true));
const mockGetPermissionsAsync = vi.hoisted(() =>
  vi.fn(async () => ({ status: "granted" }))
);
const mockRequestPermissionsAsync = vi.hoisted(() =>
  vi.fn(async () => ({ status: "granted" }))
);
const mockSetNotificationChannelAsync = vi.hoisted(() => vi.fn(async () => {}));
const mockGetExpoPushTokenAsync = vi.hoisted(() =>
  vi.fn(async () => ({ data: "ExponentPushToken[test]" }))
);

vi.mock("expo", () => ({
  isRunningInExpoGo: mockIsRunningInExpoGo,
}));

vi.mock("expo-constants", () => ({
  default: {},
}));

vi.mock("expo-notifications", () => ({
  AndroidImportance: {
    MAX: 5,
    HIGH: 4,
    DEFAULT: 3,
  },
  AndroidNotificationPriority: {
    HIGH: 1,
  },
  setNotificationChannelAsync: mockSetNotificationChannelAsync,
  getPermissionsAsync: mockGetPermissionsAsync,
  requestPermissionsAsync: mockRequestPermissionsAsync,
  getExpoPushTokenAsync: mockGetExpoPushTokenAsync,
}));

describe("lib/notifications Expo Go handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsRunningInExpoGo.mockReturnValue(true);
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted" });
    mockRequestPermissionsAsync.mockResolvedValue({ status: "granted" });
    mockGetExpoPushTokenAsync.mockResolvedValue({
      data: "ExponentPushToken[test]",
    });
  });

  it("detects Expo Go from expo runtime helper", () => {
    expect(isExpoGo()).toBe(true);
  });

  it("skips remote push token registration in Expo Go", async () => {
    const token = await registerForPushNotificationsAsync();

    expect(token).toBeNull();
    expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TestRenderer, { act } from "react-test-renderer";
import * as Notifications from "expo-notifications";
import { useNotifications } from "../../../hooks/notifications/useNotifications";

const mockRegisterForPush = vi.hoisted(() => vi.fn());

vi.mock("../../../lib/notifications", () => ({
  registerForPushNotificationsAsync: mockRegisterForPush,
}));

vi.mock("expo-notifications", () => ({
  getPermissionsAsync: vi.fn(),
  requestPermissionsAsync: vi.fn(),
}));

const waitFor = async (assertion: () => void, timeout = 1000) => {
  const start = Date.now();
  while (true) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() - start > timeout) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
};

const renderHook = (hook: () => any) => {
  let hookResult: any;

  function TestComponent() {
    hookResult = hook();
    return null;
  }

  let renderer: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(React.createElement(TestComponent));
  });

  return {
    result: {
      get current() {
        return hookResult;
      },
    },
    rerender: () => {
      act(() => {
        renderer.update(React.createElement(TestComponent));
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe("useNotifications", () => {
  let registerForPushNotificationsAsyncMock: any;
  let getPermissionsAsyncMock: any;
  let requestPermissionsAsyncMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    registerForPushNotificationsAsyncMock = mockRegisterForPush;
    getPermissionsAsyncMock = vi.fn();
    requestPermissionsAsyncMock = vi.fn();
    vi.mocked(Notifications.getPermissionsAsync).mockImplementation(
      getPermissionsAsyncMock
    );
    vi.mocked(Notifications.requestPermissionsAsync).mockImplementation(
      requestPermissionsAsyncMock
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with null values", async () => {
    registerForPushNotificationsAsyncMock.mockResolvedValue(null);
    getPermissionsAsyncMock.mockResolvedValue({ status: "undetermined" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.expoPushToken).toBeNull();
      expect(result.current.notificationStatus).toBeNull();
    });
  });

  it("should set push token on successful registration", async () => {
    const testToken = "ExponentPushToken[xxxxx]";
    registerForPushNotificationsAsyncMock.mockResolvedValue(testToken);
    getPermissionsAsyncMock.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.expoPushToken).toBe(testToken);
    });
  });

  it("should set notification status", async () => {
    registerForPushNotificationsAsyncMock.mockResolvedValue(null);
    getPermissionsAsyncMock.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.notificationStatus).toBe("granted");
      expect(result.current.isEnabled).toBe(true);
    });
  });

  it("should set isEnabled to false when not granted", async () => {
    registerForPushNotificationsAsyncMock.mockResolvedValue(null);
    getPermissionsAsyncMock.mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isEnabled).toBe(false);
    });
  });

  it("should request permissions and update status", async () => {
    registerForPushNotificationsAsyncMock.mockResolvedValue(null);
    getPermissionsAsyncMock.mockResolvedValue({ status: "undetermined" });
    requestPermissionsAsyncMock.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.notificationStatus).toBe("undetermined");
    });

    await act(async () => {
      await result.current.requestPermissions();
    });

    await waitFor(() => {
      expect(result.current.notificationStatus).toBe("granted");
    });
  });

  it("should set error when permissions denied", async () => {
    registerForPushNotificationsAsyncMock.mockResolvedValue(null);
    getPermissionsAsyncMock.mockResolvedValue({ status: "undetermined" });
    requestPermissionsAsyncMock.mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.requestPermissions();
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Notification permissions denied");
    });
  });

  it("should refresh token", async () => {
    const newToken = "ExponentPushToken[newtoken]";
    registerForPushNotificationsAsyncMock.mockResolvedValue(newToken);
    getPermissionsAsyncMock.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      const token = await result.current.refreshToken();
      expect(token).toBe(newToken);
    });

    await waitFor(() => {
      expect(result.current.expoPushToken).toBe(newToken);
    });
  });

  it("should handle registration errors", async () => {
    registerForPushNotificationsAsyncMock.mockRejectedValue(
      new Error("Registration failed")
    );
    getPermissionsAsyncMock.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.error).toBe("Registration failed");
    });
  });
});

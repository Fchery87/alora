import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TestRenderer, { act } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationReminders } from "../../../hooks/notifications/useNotificationReminders";

const { mockScheduleReminderNotification, mockCancelNotification } =
  vi.hoisted(() => ({
    mockScheduleReminderNotification: vi.fn(),
    mockCancelNotification: vi.fn(),
  }));

vi.mock("../../../lib/notifications", () => ({
  scheduleReminderNotification: mockScheduleReminderNotification,
  cancelNotification: mockCancelNotification,
}));

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

describe("useNotificationReminders", () => {
  const testBabyId = "baby-123";

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

    const renderer = TestRenderer.create(React.createElement(TestComponent));

    return {
      result: {
        get current() {
          return hookResult;
        },
      },
      rerender: () => renderer.update(React.createElement(TestComponent)),
      unmount: () => renderer.unmount(),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockScheduleReminderNotification.mockResolvedValue(undefined);
    mockCancelNotification.mockResolvedValue(undefined);
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with empty reminders", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    await waitFor(() => {
      expect(result.current.reminders).toBeDefined();
    });
  });

  it("should load default reminders when no stored reminders", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    await waitFor(() => {
      expect(result.current.reminders.length).toBeGreaterThan(0);
    });
  });

  it("should have loading state", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    expect(result.current.loading).toBeDefined();
  });

  it("should add new reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    const newReminder = {
      babyId: testBabyId,
      type: "feeding" as const,
      title: "Test Feeding",
      message: "Test message",
      intervalMinutes: 180,
      isEnabled: true,
    };

    mockScheduleReminderNotification.mockResolvedValue("notif-1");

    await act(async () => {
      const added = await result.current.addReminder(newReminder);
      expect(added).toHaveProperty("id");
      expect(added.title).toBe("Test Feeding");
      expect(added.notificationId).toBe("notif-1");
    });
  });

  it("should update existing reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    const reminderId = "default_feeding";
    mockScheduleReminderNotification.mockResolvedValue("notif-2");

    await waitFor(() => {
      expect(result.current.reminders.length).toBeGreaterThan(0);
    });

    await act(async () => {
      await result.current.updateReminder(reminderId, {
        isEnabled: true,
        notificationId: "notif-1",
      });
    });

    const updatedReminder = result.current.reminders.find(
      (r: any) => r.id === reminderId
    );
    expect(updatedReminder?.isEnabled).toBe(true);
    expect(updatedReminder?.notificationId).toBe("notif-2");
    expect(mockCancelNotification).toHaveBeenCalledWith("notif-1");
  });

  it("should delete reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    const reminderId = result.current.reminders[0]?.id;

    if (reminderId) {
      await act(async () => {
        await result.current.deleteReminder(reminderId);
      });

      expect(
        result.current.reminders.find((r: any) => r.id === reminderId)
      ).toBeUndefined();
    }
  });

  it("should toggle reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    const reminderId = "default_feeding";
    const initialReminder = result.current.reminders.find(
      (r: any) => r.id === reminderId
    );

    if (initialReminder) {
      const initialState = initialReminder.isEnabled;

      await act(async () => {
        await result.current.toggleReminder(reminderId);
      });

      const toggledReminder = result.current.reminders.find(
        (r: any) => r.id === reminderId
      );
      expect(toggledReminder?.isEnabled).toBe(!initialState);
    }
  });

  it("should have refresh function", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    expect(typeof result.current.refresh).toBe("function");
  });

  it("should include default feeding reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    await waitFor(() => {
      const feedingReminder = result.current.reminders.find(
        (r: any) => r.type === "feeding"
      );
      expect(feedingReminder).toBeDefined();
      expect(feedingReminder?.title).toBe("Feeding Time");
    });
  });

  it("should include default sleep reminder", async () => {
    const { result } = renderHook(() => useNotificationReminders(testBabyId));

    await waitFor(() => {
      const sleepReminder = result.current.reminders.find(
        (r: any) => r.type === "sleep"
      );
      expect(sleepReminder).toBeDefined();
      expect(sleepReminder?.title).toBe("Sleep Reminder");
    });
  });
});

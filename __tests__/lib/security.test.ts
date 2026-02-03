import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SecurityManager } from "../../lib/security";
import { AppState } from "react-native";

describe("SecurityManager auto-lock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (AppState.addEventListener as any).mockClear();
  });

  afterEach(() => {
    SecurityManager.teardownAutoLock();
    vi.useRealTimers();
  });

  it("cleans up interval and app state subscription", () => {
    const clearSpy = vi.spyOn(global, "clearInterval");

    SecurityManager.setupAutoLock();

    const subscription = (AppState.addEventListener as any).mock.results[0]
      .value;

    SecurityManager.teardownAutoLock();

    expect(clearSpy).toHaveBeenCalled();
    expect(subscription.remove).toHaveBeenCalled();
  });
});

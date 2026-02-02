import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";

vi.mock("@clerk/clerk-expo", () => ({
  useAuth: () => ({ userId: "user_1" }),
}));

const mockUseActivityFeed = vi.fn();
vi.mock("@/hooks/useActivityFeed", () => ({
  useActivityFeed: (...args: any[]) => mockUseActivityFeed(...args),
}));

describe("ActivityFeed", () => {
  beforeEach(() => {
    mockUseActivityFeed.mockReset();
  });

  it("renders empty state when no activities", () => {
    mockUseActivityFeed.mockReturnValue({
      groupedActivities: { today: [], yesterday: [], earlier: [] },
      isLoading: false,
      error: null,
    });

    render(<ActivityFeed limit={5} />);

    expect(screen.getByText(/No activity yet/i)).toBeTruthy();
    expect(
      screen.getByText(/Start logging feeds, diapers, sleep, and more/i)
    ).toBeTruthy();
  });

  it("renders loading skeleton", () => {
    mockUseActivityFeed.mockReturnValue({
      groupedActivities: { today: [], yesterday: [], earlier: [] },
      isLoading: true,
      error: null,
    });

    expect(() => render(<ActivityFeed limit={5} />)).not.toThrow();
  });

  it("displays activities grouped by time", () => {
    mockUseActivityFeed.mockReturnValue({
      groupedActivities: {
        today: [
          {
            id: "1",
            type: "feed",
            userId: "user1",
            userName: "Alex",
            userAvatarUrl: undefined,
            timestamp: Date.now(),
            message: "Alex logged a breast feeding (15 min)",
            icon: "restaurant",
            iconColor: "#ea580c",
            iconBgColor: "#ffedd5",
          },
        ],
        yesterday: [],
        earlier: [],
      },
      isLoading: false,
      error: null,
    });

    render(<ActivityFeed limit={5} />);
    expect(screen.getByText(/Today/i)).toBeTruthy();
    expect(screen.getByText(/Alex logged a breast feeding/i)).toBeTruthy();
  });

  it("shows live indicator when activity exists", () => {
    mockUseActivityFeed.mockReturnValue({
      groupedActivities: {
        today: [
          {
            id: "1",
            type: "feed",
            userId: "user1",
            userName: "Alex",
            userAvatarUrl: undefined,
            timestamp: Date.now(),
            message: "Activity",
            icon: "restaurant",
            iconColor: "#ea580c",
            iconBgColor: "#ffedd5",
          },
        ],
        yesterday: [],
        earlier: [],
      },
      isLoading: false,
      error: null,
    });

    render(<ActivityFeed limit={5} />);
    expect(screen.getByText(/Live/i)).toBeTruthy();
  });
});

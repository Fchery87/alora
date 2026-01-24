import React from "react";
import { render } from "@testing-library/react-native";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convex";

describe("ActivityFeed", () => {
  it("renders empty state when no activities", () => {
    const { getByText } = render(
      <ConvexProvider client={convex}>
        <ActivityFeed limit={5} />
      </ConvexProvider>
    );

    expect(getByText(/No activity yet/i)).toBeTruthy();
    expect(getByText(/Start logging feeds, diapers, sleep/i)).toBeTruthy();
  });

  it("renders loading skeleton", () => {
    // Mock the hook to return loading state
    jest.mock("@/hooks/useActivityFeed", () => ({
      useActivityFeed: () => ({
        groupedActivities: {
          today: [],
          yesterday: [],
          earlier: [],
        },
        isLoading: true,
        error: null,
      }),
    }));

    const { getByTestId } = render(
      <ConvexProvider client={convex}>
        <ActivityFeed limit={5} />
      </ConvexProvider>
    );

    // Check for skeleton elements
    expect(getByTestId(/skeleton/i)).toBeTruthy();
  });

  it("displays activities grouped by time", () => {
    // Mock the hook to return sample activities
    jest.mock("@/hooks/useActivityFeed", () => ({
      useActivityFeed: () => ({
        groupedActivities: {
          today: [
            {
              id: "1",
              type: "feed",
              userId: "user1" as any,
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
      }),
    }));

    const { getByText } = render(
      <ConvexProvider client={convex}>
        <ActivityFeed limit={5} />
      </ConvexProvider>
    );

    expect(getByText(/Today/i)).toBeTruthy();
    expect(getByText(/Alex logged a breast feeding/i)).toBeTruthy();
  });

  it("shows live indicator when activity exists", () => {
    jest.mock("@/hooks/useActivityFeed", () => ({
      useActivityFeed: () => ({
        groupedActivities: {
          today: [
            {
              id: "1",
              type: "feed",
              userId: "user1" as any,
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
      }),
    }));

    const { getByText } = render(
      <ConvexProvider client={convex}>
        <ActivityFeed limit={5} />
      </ConvexProvider>
    );

    expect(getByText(/Live/i)).toBeTruthy();
  });
});

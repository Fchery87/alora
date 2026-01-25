import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react-native";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";

vi.mock("@/hooks/useActivityFeed", () => ({
  useActivityFeed: () => ({
    groupedActivities: {
      today: [],
      yesterday: [],
      earlier: [],
    },
    isLoading: false,
    error: null,
  }),
}));

describe("ActivityFeed", () => {
  it("renders empty state when no activities", () => {
    const { getByText } = render(<ActivityFeed limit={5} />);
    expect(getByText(/No activity yet/i)).toBeTruthy();
  });
});

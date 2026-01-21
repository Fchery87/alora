import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { FeedCard } from "@/components/molecules";

describe("FeedCard Component", () => {
  const mockFeed = {
    id: "feed-1",
    type: "breast",
    side: "left",
    amount: "5 oz",
    duration: 15,
    startTime: Date.now(),
    notes: "Feeding went well",
    babyId: "baby-1",
  };

  it("should render feed card with correct details", () => {
    render(
      <FeedCard feed={mockFeed as any} onPress={() => {}} onDelete={() => {}} />
    );

    expect(screen.getByText(/breast/)).toBeTruthy();
    expect(screen.getByText(/left/)).toBeTruthy();
    expect(screen.getByText(/5 oz/)).toBeTruthy();
    expect(screen.getByText(/15 min/)).toBeTruthy();
  });

  it("should render notes when provided", () => {
    render(
      <FeedCard feed={mockFeed as any} onPress={() => {}} onDelete={() => {}} />
    );

    expect(screen.getByText(/Feeding went well/)).toBeTruthy();
  });

  it("should call onPress when card is pressed", () => {
    const onPress = vi.fn();
    const onDelete = vi.fn();

    render(
      <FeedCard feed={mockFeed as any} onPress={onPress} onDelete={onDelete} />
    );

    const card = screen.getByTestId("feed-card-1");
    card.props.onPress();

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

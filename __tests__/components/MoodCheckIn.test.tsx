import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { MoodCheckIn } from "@/components/organisms/MoodCheckIn";

describe("MoodCheckIn", () => {
  it("renders correctly", () => {
    render(<MoodCheckIn />);
    expect(screen.getByText("How are you feeling?")).toBeTruthy();
    expect(screen.getByText("Your mood")).toBeTruthy();
  });

  it("shows mood options", () => {
    render(<MoodCheckIn />);
    expect(screen.getByText("Great")).toBeTruthy();
    expect(screen.getByText("Good")).toBeTruthy();
    expect(screen.getByText("Okay")).toBeTruthy();
    expect(screen.getByText("Low")).toBeTruthy();
    expect(screen.getByText("Struggling")).toBeTruthy();
  });

  it("shows emoji for each mood", () => {
    render(<MoodCheckIn />);
    expect(screen.getByText("😊")).toBeTruthy();
    expect(screen.getByText("🙂")).toBeTruthy();
    expect(screen.getByText("😐")).toBeTruthy();
    expect(screen.getByText("😔")).toBeTruthy();
    expect(screen.getByText("😢")).toBeTruthy();
  });

  it("shows additional details when toggled", () => {
    render(<MoodCheckIn />);
    const detailsToggle = screen.getByText("Add more details");
    fireEvent.press(detailsToggle);
    expect(screen.getByText("Energy level")).toBeTruthy();
    expect(screen.getByText("Feeling anxious?")).toBeTruthy();
  });

  it("shows check in button", () => {
    render(<MoodCheckIn />);
    expect(screen.getByText("Check In")).toBeTruthy();
  });
});

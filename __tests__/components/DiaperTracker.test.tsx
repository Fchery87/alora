import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";

describe("DiaperTracker", () => {
  it("renders correctly", () => {
    render(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Log Diaper")).toBeTruthy();
    expect(screen.getByText("Type")).toBeTruthy();
  });

  it("shows diaper type options", () => {
    render(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Wet")).toBeTruthy();
    expect(screen.getByText("Dirty")).toBeTruthy();
    expect(screen.getByText("Mixed")).toBeTruthy();
  });

  it("shows color picker when toggled", () => {
    render(<DiaperTracker babyId="test-baby" />);
    const colorToggle = screen.getByText("Color (optional)");
    fireEvent.press(colorToggle);
    expect(screen.getByText("Yellow")).toBeTruthy();
    expect(screen.getByText("N/A")).toBeTruthy();
  });

  it("shows submit button", () => {
    render(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Log Diaper")).toBeTruthy();
  });
});

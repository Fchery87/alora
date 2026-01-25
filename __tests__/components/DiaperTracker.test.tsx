import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react-native";
import { DiaperTracker } from "@/components/organisms/DiaperTracker";
import { renderWithProviders } from "../setup";

describe("DiaperTracker", () => {
  it("renders correctly", () => {
    renderWithProviders(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Log Diaper")).toBeTruthy();
    expect(screen.getByText("Type")).toBeTruthy();
  });

  it("shows diaper type options", () => {
    renderWithProviders(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Wet")).toBeTruthy();
    expect(screen.getByText("Dirty")).toBeTruthy();
    expect(screen.getByText("Mixed")).toBeTruthy();
  });

  it("shows color picker when toggled", () => {
    renderWithProviders(<DiaperTracker babyId="test-baby" />);
    const colorToggle = screen.getByText("Color (optional)");
    fireEvent.press(colorToggle);
    expect(screen.getByText("Yellow")).toBeTruthy();
    expect(screen.getByText("N/A")).toBeTruthy();
  });

  it("shows submit button", () => {
    renderWithProviders(<DiaperTracker babyId="test-baby" />);
    expect(screen.getByText("Log Diaper")).toBeTruthy();
  });
});

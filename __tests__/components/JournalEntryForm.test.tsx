import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { JournalEntryForm } from "@/components/organisms/JournalEntryForm";

describe("JournalEntryForm", () => {
  it("renders correctly", () => {
    render(<JournalEntryForm />);
    expect(screen.getByText("Quick Journal")).toBeTruthy();
  });

  it("shows title input", () => {
    render(<JournalEntryForm />);
    expect(
      screen.getByPlaceholderText("Give this entry a title...")
    ).toBeTruthy();
  });

  it("shows content input", () => {
    render(<JournalEntryForm />);
    expect(
      screen.getByPlaceholderText("Write your thoughts here...")
    ).toBeTruthy();
  });

  it("shows suggested tags", () => {
    render(<JournalEntryForm />);
    expect(screen.getByText("#grateful")).toBeTruthy();
    expect(screen.getByText("#win")).toBeTruthy();
    expect(screen.getByText("#struggle")).toBeTruthy();
  });

  it("shows toggle buttons", () => {
    render(<JournalEntryForm />);
    expect(screen.getByText("Gratitude")).toBeTruthy();
    expect(screen.getByText("Win")).toBeTruthy();
  });

  it("shows save button", () => {
    render(<JournalEntryForm />);
    expect(screen.getByText("Save Entry")).toBeTruthy();
  });
});

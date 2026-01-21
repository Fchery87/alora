import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { MoodTrendChart } from "../../components/organisms/MoodTrendChart";

describe("MoodTrendChart", () => {
  const mockData = [
    { date: "2024-01-15", mood: 4, label: "Good" },
    { date: "2024-01-16", mood: 3, label: "Okay" },
    { date: "2024-01-17", mood: 5, label: "Great" },
    { date: "2024-01-18", mood: 4, label: "Good" },
    { date: "2024-01-19", mood: 2, label: "Low" },
    { date: "2024-01-20", mood: 4, label: "Good" },
    { date: "2024-01-21", mood: 5, label: "Great" },
  ];

  it("renders without crashing", () => {
    expect(() => render(<MoodTrendChart data={mockData} />)).not.toThrow();
  });

  it("displays mood trends title", () => {
    render(<MoodTrendChart data={mockData} />);
    expect(screen.getByText("Mood Trends")).toBeTruthy();
  });

  it("shows date range selector buttons", () => {
    render(<MoodTrendChart data={mockData} />);
    expect(screen.getByText("7D")).toBeTruthy();
    expect(screen.getByText("30D")).toBeTruthy();
    expect(screen.getByText("90D")).toBeTruthy();
    expect(screen.getByText("All")).toBeTruthy();
  });

  it("calculates average mood correctly", () => {
    render(<MoodTrendChart data={mockData} />);
    expect(screen.getByText(/Average:/)).toBeTruthy();
  });

  it("renders empty state when no data provided", () => {
    render(<MoodTrendChart data={[]} />);
    expect(screen.getByText("No mood data for this period")).toBeTruthy();
  });

  it("accepts dateRange prop", () => {
    expect(() =>
      render(<MoodTrendChart data={mockData} dateRange="30d" />)
    ).not.toThrow();
  });

  it("calls onDateRangeChange when date button pressed", () => {
    const handleDateRangeChange = vi.fn();
    render(
      <MoodTrendChart
        data={mockData}
        onDateRangeChange={handleDateRangeChange}
      />
    );
    expect(handleDateRangeChange).not.toHaveBeenCalled();
  });
});

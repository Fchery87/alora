import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { SleepTrendChart } from "../../components/organisms/SleepTrendChart";

describe("SleepTrendChart", () => {
  const mockData = [
    { date: "2024-01-15", totalHours: 14, nightSleep: 10, napSleep: 4 },
    { date: "2024-01-16", totalHours: 15, nightSleep: 11, napSleep: 4 },
    { date: "2024-01-17", totalHours: 13, nightSleep: 9, napSleep: 4 },
    { date: "2024-01-18", totalHours: 16, nightSleep: 11, napSleep: 5 },
    { date: "2024-01-19", totalHours: 14, nightSleep: 10, napSleep: 4 },
    { date: "2024-01-20", totalHours: 15, nightSleep: 10, napSleep: 5 },
    { date: "2024-01-21", totalHours: 14, nightSleep: 9, napSleep: 5 },
  ];

  it("renders without crashing", () => {
    expect(() => render(<SleepTrendChart data={mockData} />)).not.toThrow();
  });

  it("displays sleep trends title", () => {
    render(<SleepTrendChart data={mockData} />);
    expect(screen.getByText("Sleep Trends")).toBeTruthy();
  });

  it("shows quality badge", () => {
    render(<SleepTrendChart data={mockData} dateRange="all" />);
    expect(screen.getByText("Good")).toBeTruthy();
  });

  it("shows average sleep stat", () => {
    render(<SleepTrendChart data={mockData} />);
    expect(screen.getByText(/Avg \/ night/)).toBeTruthy();
  });

  it("shows night and daytime sleep breakdown", () => {
    render(<SleepTrendChart data={mockData} />);
    expect(screen.getByText("Night sleep")).toBeTruthy();
    expect(screen.getByText("Day sleep")).toBeTruthy();
  });

  it("renders empty state when no data provided", () => {
    render(<SleepTrendChart data={[]} />);
    expect(screen.getByText("No sleep data for this period")).toBeTruthy();
  });

  it("accepts dateRange prop", () => {
    expect(() =>
      render(<SleepTrendChart data={mockData} dateRange="30d" />)
    ).not.toThrow();
  });

  it("shows legend for night and daytime", () => {
    render(<SleepTrendChart data={mockData} />);
    expect(screen.getByText("Night")).toBeTruthy();
    expect(screen.getByText("Daytime")).toBeTruthy();
  });
});

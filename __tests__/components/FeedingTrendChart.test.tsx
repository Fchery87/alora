import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { FeedingTrendChart } from "../../components/organisms/FeedingTrendChart";

describe("FeedingTrendChart", () => {
  const mockData = [
    { date: "2024-01-15", totalFeeds: 10, breastfeeding: 6, bottle: 4 },
    { date: "2024-01-16", totalFeeds: 9, breastfeeding: 5, bottle: 4 },
    { date: "2024-01-17", totalFeeds: 11, breastfeeding: 7, bottle: 4 },
    { date: "2024-01-18", totalFeeds: 10, breastfeeding: 6, bottle: 4 },
    { date: "2024-01-19", totalFeeds: 8, breastfeeding: 4, bottle: 4 },
    { date: "2024-01-20", totalFeeds: 10, breastfeeding: 6, bottle: 4 },
    { date: "2024-01-21", totalFeeds: 9, breastfeeding: 5, bottle: 4 },
  ];

  it("renders without crashing", () => {
    expect(() => render(<FeedingTrendChart data={mockData} />)).not.toThrow();
  });

  it("displays feeding trends title", () => {
    render(<FeedingTrendChart data={mockData} />);
    expect(screen.getByText("Feeding Trends")).toBeTruthy();
  });

  it("shows pattern badge", () => {
    render(<FeedingTrendChart data={mockData} dateRange="all" />);
    expect(screen.getByText("Regular")).toBeTruthy();
  });

  it("shows average feeds stat", () => {
    render(<FeedingTrendChart data={mockData} />);
    expect(screen.getByText(/Avg \/ day/)).toBeTruthy();
  });

  it("shows breastfeeding and bottle percentages", () => {
    render(<FeedingTrendChart data={mockData} />);
    expect(screen.getByText("Breast")).toBeTruthy();
    expect(screen.getByText("Bottle")).toBeTruthy();
  });

  it("renders empty state when no data provided", () => {
    render(<FeedingTrendChart data={[]} />);
    expect(screen.getByText("No feeding data for this period")).toBeTruthy();
  });

  it("accepts dateRange prop", () => {
    expect(() =>
      render(<FeedingTrendChart data={mockData} dateRange="30d" />)
    ).not.toThrow();
  });

  it("shows legend for breast and bottle", () => {
    render(<FeedingTrendChart data={mockData} />);
    expect(screen.getByText("Breast")).toBeTruthy();
    expect(screen.getByText("Bottle")).toBeTruthy();
  });
});

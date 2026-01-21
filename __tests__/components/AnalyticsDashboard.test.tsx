import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { AnalyticsDashboard } from "../../components/organisms/AnalyticsDashboard";

describe("AnalyticsDashboard", () => {
  const mockMoodData = [
    { date: "2024-01-15", mood: 4 },
    { date: "2024-01-16", mood: 3 },
    { date: "2024-01-17", mood: 5 },
  ];

  const mockSleepData = [
    { date: "2024-01-15", totalHours: 14, nightSleep: 10, napSleep: 4 },
    { date: "2024-01-16", totalHours: 15, nightSleep: 11, napSleep: 4 },
    { date: "2024-01-17", totalHours: 13, nightSleep: 9, napSleep: 4 },
  ];

  const mockFeedingData = [
    { date: "2024-01-15", totalFeeds: 10, breastfeeding: 6, bottle: 4 },
    { date: "2024-01-16", totalFeeds: 9, breastfeeding: 5, bottle: 4 },
    { date: "2024-01-17", totalFeeds: 11, breastfeeding: 7, bottle: 4 },
  ];

  const mockGrowthData = {
    data: [
      { date: "2024-01-01", weight: 3.5 },
      { date: "2024-02-01", weight: 4.2 },
      { date: "2024-03-01", weight: 5.0 },
    ],
    metric: "weight" as const,
    babyAgeInMonths: 3,
  };

  it("renders without crashing", () => {
    expect(() =>
      render(
        <AnalyticsDashboard
          moodData={mockMoodData}
          sleepData={mockSleepData}
          feedingData={mockFeedingData}
        />
      )
    ).not.toThrow();
  });

  it("displays analytics title", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("Analytics")).toBeTruthy();
  });

  it("shows date range selector", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("7 Days")).toBeTruthy();
    expect(screen.getByText("30 Days")).toBeTruthy();
    expect(screen.getByText("90 Days")).toBeTruthy();
    expect(screen.getByText("All Time")).toBeTruthy();
  });

  it("displays summary section with stats", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("This Period")).toBeTruthy();
    expect(screen.getByText("Avg Mood")).toBeTruthy();
    expect(screen.getByText("Avg Sleep")).toBeTruthy();
    expect(screen.getByText("Avg Feeds")).toBeTruthy();
  });

  it("renders loading state when isLoading is true", () => {
    render(<AnalyticsDashboard isLoading={true} />);
    expect(screen.getByText("Loading analytics...")).toBeTruthy();
  });

  it("renders error state when error is provided", () => {
    render(<AnalyticsDashboard error="Failed to load data" />);
    expect(screen.getByText("Unable to load analytics")).toBeTruthy();
  });

  it("shows empty state when no data is provided", () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText("No data yet")).toBeTruthy();
  });

  it("renders growth chart when growthData is provided", () => {
    render(
      <AnalyticsDashboard
        growthData={mockGrowthData}
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("Growth")).toBeTruthy();
  });

  it("renders mood chart when moodData is provided", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("Mood Trends")).toBeTruthy();
  });

  it("renders sleep chart when sleepData is provided", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("Sleep Trends")).toBeTruthy();
  });

  it("renders feeding chart when feedingData is provided", () => {
    render(
      <AnalyticsDashboard
        moodData={mockMoodData}
        sleepData={mockSleepData}
        feedingData={mockFeedingData}
      />
    );
    expect(screen.getByText("Feeding Trends")).toBeTruthy();
  });

  it("accepts dateRange prop", () => {
    expect(() =>
      render(
        <AnalyticsDashboard
          moodData={mockMoodData}
          sleepData={mockSleepData}
          feedingData={mockFeedingData}
        />
      )
    ).not.toThrow();
  });
});

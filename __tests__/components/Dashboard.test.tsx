import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { Dashboard } from "@/components/organisms/Dashboard";

describe("Dashboard", () => {
  it("renders correctly", () => {
    render(<Dashboard />);
    expect(screen.getByText("Today")).toBeTruthy();
  });

  it("shows quick actions section", () => {
    render(<Dashboard />);
    expect(screen.getByText("Stamps")).toBeTruthy();
    expect(screen.getByText("Feed")).toBeTruthy();
    expect(screen.getByText("Diaper")).toBeTruthy();
    expect(screen.getByText("Sleep")).toBeTruthy();
    expect(screen.getByText("Check-in")).toBeTruthy();
  });

  it("shows today section", () => {
    render(<Dashboard />);
    expect(screen.getByText("Today's summary")).toBeTruthy();
  });

  it("shows recent activity section", () => {
    render(<Dashboard />);
    expect(screen.getByText("Recent entries")).toBeTruthy();
  });

  it("shows mood section", () => {
    render(<Dashboard />);
    expect(screen.getByText("Care")).toBeTruthy();
  });

  it("displays today's stats", () => {
    render(<Dashboard todayFeeds={3} todayDiapers={5} todaySleep="2h 30m" />);
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("2h 30m")).toBeTruthy();
  });
});

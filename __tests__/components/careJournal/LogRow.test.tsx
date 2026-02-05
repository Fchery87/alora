import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { LogRow } from "@/components/care-journal/LogRow";

describe("LogRow", () => {
  it("renders time, title, and value", () => {
    render(<LogRow time="3:12 AM" title="Bottle" value="4 oz" />);
    expect(screen.getByText("3:12 AM")).toBeTruthy();
    expect(screen.getByText("Bottle")).toBeTruthy();
    expect(screen.getByText("4 oz")).toBeTruthy();
  });

  it("uses tabular numerals for time", () => {
    render(<LogRow time="3:12 AM" title="Bottle" value="4 oz" />);
    const timeNode = screen.getByText("3:12 AM");
    const style = timeNode.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flat.fontVariant).toEqual(["tabular-nums"]);
  });
});


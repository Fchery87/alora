import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { BACKGROUND, TEXT } from "@/lib/theme";

vi.mock("expo-router", () => ({
  useNavigation: () => ({ goBack: vi.fn() }),
}));

describe("Header", () => {
  it("renders the title", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header title="Explore" />);
    expect(screen.getByText("Explore")).toBeTruthy();
  });

  it("uses Care Journal background and ink text", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header title="Explore" />);
    const root = screen.getByTestId("header");
    const style = root.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flat.backgroundColor).toBe(BACKGROUND.primary);
    expect(flat.borderBottomColor).toBe(BACKGROUND.tertiary);

    const title = screen.getByText("Explore");
    const titleStyle = title.props.style;
    const titleFlat = Array.isArray(titleStyle)
      ? Object.assign({}, ...titleStyle)
      : titleStyle;
    expect(titleFlat.color).toBe(TEXT.primary);
  });
});

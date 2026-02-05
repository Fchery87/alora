import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { StampButton } from "@/components/care-journal/StampButton";

describe("StampButton", () => {
  const onPress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the label", () => {
    render(<StampButton label="Feed" onPress={onPress} />);
    expect(screen.getByText("Feed")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    render(<StampButton label="Feed" onPress={onPress} />);
    fireEvent.press(screen.getByText("Feed"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    render(<StampButton label="Feed" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText("Feed"));
    expect(onPress).not.toHaveBeenCalled();
  });
});


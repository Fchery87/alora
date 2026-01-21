import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  size?: "small" | "large";
  disabled?: boolean;
}

function Button({
  title,
  onPress,
  variant = "primary",
  size = "large",
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      testID="button"
      style={[
        styles.button,
        variant === "secondary" && styles.buttonSecondary,
        size === "small" && styles.buttonSmall,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.buttonTextSecondary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  buttonSmall: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#6366f1",
  },
});

describe("Button Component", () => {
  const mockOnPress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render button with title", () => {
    render(<Button title="Click Me" onPress={mockOnPress} />);

    expect(screen.getByText("Click Me")).toBeTruthy();
  });

  it("should call onPress when pressed", () => {
    render(<Button title="Click Me" onPress={mockOnPress} />);

    const button = screen.getByTestId("button");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("should not call onPress when disabled", () => {
    render(<Button title="Click Me" onPress={mockOnPress} disabled />);

    const button = screen.getByTestId("button");
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("should render with different variants", () => {
    const { rerender } = render(
      <Button title="Primary" onPress={mockOnPress} variant="primary" />
    );
    expect(screen.getByText("Primary")).toBeTruthy();

    rerender(
      <Button title="Secondary" onPress={mockOnPress} variant="secondary" />
    );
    expect(screen.getByText("Secondary")).toBeTruthy();
  });

  it("should render with different sizes", () => {
    const { rerender } = render(
      <Button title="Small" onPress={mockOnPress} size="small" />
    );
    expect(screen.getByText("Small")).toBeTruthy();

    rerender(<Button title="Large" onPress={mockOnPress} size="large" />);
    expect(screen.getByText("Large")).toBeTruthy();
  });
});

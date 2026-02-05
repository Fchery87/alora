import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { JournalScaffold } from "@/components/care-journal/JournalScaffold";

describe("JournalScaffold", () => {
  it("renders title and children", () => {
    render(
      <JournalScaffold title="Today">
        <Text>Content</Text>
      </JournalScaffold>
    );

    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Content")).toBeTruthy();
  });
});


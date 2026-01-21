import React from "react";
import TestRenderer from "react-test-renderer";

type RenderResult = {
  getByText: (text: string | RegExp) => any;
  getByTestId: (testId: string) => any;
  getByPlaceholderText: (placeholder: string | RegExp) => any;
  queryByText: (text: string) => any;
  rerender: (ui: React.ReactElement) => void;
  unmount: () => void;
};

let lastRender: RenderResult | null = null;

const matchesText = (content: string, matcher: string | RegExp) => {
  if (matcher instanceof RegExp) {
    return matcher.test(content);
  }
  return content.includes(matcher);
};

const findByText = (
  root: TestRenderer.ReactTestRenderer,
  text: string | RegExp
) => {
  const matches = root.root.findAll((node) => {
    if (!node.children || node.children.length === 0) return false;
    const content = node.children.join("");
    return typeof content === "string" && matchesText(content, text);
  });
  if (matches.length === 0) {
    throw new Error(`Unable to find text: ${text}`);
  }
  return matches[0];
};

const findByTestId = (
  root: TestRenderer.ReactTestRenderer,
  testId: string
) => {
  const matches = root.root.findAll(
    (node) => node.props && node.props.testID === testId
  );
  if (matches.length === 0) {
    throw new Error(`Unable to find testID: ${testId}`);
  }
  return matches[0];
};

const findByPlaceholderText = (
  root: TestRenderer.ReactTestRenderer,
  placeholder: string | RegExp
) => {
  const matches = root.root.findAll(
    (node) =>
      node.props &&
      typeof node.props.placeholder === "string" &&
      matchesText(node.props.placeholder, placeholder)
  );
  if (matches.length === 0) {
    throw new Error(`Unable to find placeholder: ${placeholder}`);
  }
  return matches[0];
};

export const render = (ui: React.ReactElement): RenderResult => {
  const renderer = TestRenderer.create(ui);

  const result: RenderResult = {
    getByText: (text: string) => findByText(renderer, text),
    getByTestId: (testId: string) => findByTestId(renderer, testId),
    getByPlaceholderText: (placeholder: string | RegExp) =>
      findByPlaceholderText(renderer, placeholder),
    queryByText: (text: string) => {
      try {
        return findByText(renderer, text);
      } catch {
        return null;
      }
    },
    rerender: (nextUi) => renderer.update(nextUi),
    unmount: () => renderer.unmount(),
  };

  lastRender = result;
  return result;
};

export const screen = {
  getByText: (text: string | RegExp) => {
    if (!lastRender) {
      throw new Error("No render found");
    }
    return lastRender.getByText(text);
  },
  getByTestId: (testId: string) => {
    if (!lastRender) {
      throw new Error("No render found");
    }
    return (lastRender as any).getByTestId(testId);
  },
  getByPlaceholderText: (placeholder: string | RegExp) => {
    if (!lastRender) {
      throw new Error("No render found");
    }
    return (lastRender as any).getByPlaceholderText(placeholder);
  },
  queryByText: (text: string | RegExp) => {
    if (!lastRender) {
      return null;
    }
    return lastRender.queryByText(text);
  },
};

export const fireEvent = {
  press: (element: any) => {
    let current = element;
    while (current && !current.props?.onPress) {
      current = current.parent;
    }
    if (!current?.props?.onPress) {
      return;
    }
    if (current.props.disabled) {
      return;
    }
    TestRenderer.act(() => {
      current.props.onPress();
    });
  },
};

export const renderHook = (hook: () => any) => {
  let hookResult: any;

  function TestComponent() {
    hookResult = hook();
    return null;
  }

  const renderer = TestRenderer.create(React.createElement(TestComponent));

  return {
    result: {
      get current() {
        return hookResult;
      },
    },
    rerender: () => renderer.update(React.createElement(TestComponent)),
    unmount: () => renderer.unmount(),
  };
};

export const waitFor = async (assertion: () => void, timeout = 1000) => {
  const start = Date.now();
  while (true) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() - start > timeout) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
};

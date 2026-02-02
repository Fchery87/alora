/* eslint-disable react/display-name */
import React from "react";
import { vi } from "vitest";

const createComponent =
  (name: string) =>
  ({ children, ...props }: any) =>
    React.createElement(name, props, children);

export const View = createComponent("View");
export const Text = createComponent("Text");
export const ScrollView = createComponent("ScrollView");
export const TouchableOpacity = createComponent("TouchableOpacity");
export const Pressable = createComponent("Pressable");
export const TextInput = createComponent("TextInput");
export const ActivityIndicator = createComponent("ActivityIndicator");
export const Image = createComponent("Image");
export const RefreshControl = createComponent("RefreshControl");
export const StyleSheet = {
  create: (styles: any) => styles,
  flatten: (style: any) => {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style ?? {};
  },
  hairlineWidth: 1,
};

class AnimatedValue {
  _value: number;
  constructor(value: number) {
    this._value = value;
  }
  setValue(value: number) {
    this._value = value;
  }
}

export const Animated = {
  Value: AnimatedValue as any,
  timing: () => ({ start: (cb?: any) => cb?.() }),
  sequence: () => ({ start: (cb?: any) => cb?.() }),
  loop: () => ({ start: (cb?: any) => cb?.() }),
  View: createComponent("Animated.View"),
};
export const Platform = {
  OS: "ios",
  select: (obj: any) => obj?.ios ?? obj?.default,
};
export const Dimensions = {
  get: (_: string) => ({ width: 375, height: 812 }),
};
export const DeviceEventEmitter = {
  addListener: vi.fn(),
  removeListener: vi.fn(),
};

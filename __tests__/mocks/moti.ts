import React from "react";

const createMotiComponent =
  (name: string) =>
  ({ children, ...props }: any) =>
    React.createElement(name, props, children);

export const MotiView = createMotiComponent("MotiView");
export const MotiText = createMotiComponent("MotiText");
export const AnimatePresence = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export default { MotiView, MotiText, AnimatePresence };

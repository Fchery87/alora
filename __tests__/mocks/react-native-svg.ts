/* eslint-disable react/display-name */
import React from "react";

const createSvgComponent =
  (name: string) =>
  ({ children, ...props }: any) =>
    React.createElement(name, props, children);

export const Svg = createSvgComponent("Svg");
export const Path = createSvgComponent("Path");
export const Circle = createSvgComponent("Circle");
export const Rect = createSvgComponent("Rect");
export const G = createSvgComponent("G");
export const Defs = createSvgComponent("Defs");
export const LinearGradient = createSvgComponent("LinearGradient");
export const Stop = createSvgComponent("Stop");

export default Svg;

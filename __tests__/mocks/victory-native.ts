import React from "react";

const createChart =
  (_name: string) =>
  ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);

export const VictoryPie = createChart("VictoryPie");
export const VictoryLine = createChart("VictoryLine");
export const VictoryBar = createChart("VictoryBar");
export const VictoryArea = createChart("VictoryArea");
export const VictoryChart = createChart("VictoryChart");
export const VictoryAxis = createChart("VictoryAxis");
export const VictoryStack = createChart("VictoryStack");
export const VictoryScatter = createChart("VictoryScatter");
export const VictoryTheme = {
  grayscale: {},
};

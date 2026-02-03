module.exports = function (api) {
  api.cache(true);

  // Detect if we're building for web
  const isWeb = api.caller((caller) => caller && caller.name === "web");

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Only include reanimated plugin for native builds, not web
      !isWeb && "react-native-reanimated/plugin",
    ].filter(Boolean),
  };
};

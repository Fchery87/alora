module.exports = function (api) {
  // Use permanent cache for stability
  api.cache.forever();

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated plugin - will be handled by its own config
      "react-native-reanimated/plugin",
    ],
  };
};

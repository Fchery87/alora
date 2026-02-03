module.exports = function (api) {
  // Use permanent cache for stability
  api.cache.forever();

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
      // Reanimated plugin
      "react-native-reanimated/plugin",
    ],
  };
};

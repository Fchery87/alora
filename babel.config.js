module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Reanimated plugin MUST run first to properly instrument worklets
      "react-native-reanimated/plugin",
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./config/tamagui.config.ts",
          logTimings: true,
        },
      ],
    ],
  };
};

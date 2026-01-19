module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["react-native-reusables"],
          config: "./config/tamagui.config.ts",
        },
      ],
    ],
  };
};

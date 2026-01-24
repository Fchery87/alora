/* eslint-disable no-undef */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Enable experimental import support for proper module handling
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

// Apply Tamagui Metro plugin for optimizations
module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./config/tamagui.config.ts",
  outputCSS: "./tamagui-web.css",
});

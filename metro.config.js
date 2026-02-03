/* eslint-disable no-undef */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Configure resolver for web compatibility
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

// Disable experimental import support to avoid module issues
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

// Apply standard Expo Metro configuration
module.exports = config;

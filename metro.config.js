/* eslint-disable no-undef */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Configure resolver for web compatibility
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

// Avoid ESM/CJS interop issues for `nanoid/non-secure` (used by expo-router + react-navigation).
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  "nanoid/non-secure": path.resolve(__dirname, "lib/shims/nanoid-non-secure.ts"),
};

// Disable experimental import support to avoid module issues
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

// Apply standard Expo Metro configuration
module.exports = config;

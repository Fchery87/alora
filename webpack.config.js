const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Fix for import.meta issues
  config.module.rules.forEach((rule) => {
    if (rule.oneOf) {
      rule.oneOf.forEach((oneOfRule) => {
        if (
          oneOfRule.use &&
          oneOfRule.use.loader &&
          oneOfRule.use.loader.includes("babel")
        ) {
          // Ensure proper module handling
          oneOfRule.use.options = {
            ...oneOfRule.use.options,
            sourceType: "unambiguous",
          };
        }
      });
    }
  });

  // Resolve aliases for web
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native$": "react-native-web",
  };

  // Fix for native modules that shouldn't be bundled for web
  config.resolve.extensions = [
    ".web.js",
    ".web.jsx",
    ".web.ts",
    ".web.tsx",
    ...config.resolve.extensions,
  ];

  return config;
};

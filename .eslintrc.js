module.exports = {
  root: true,
  extends: ["eslint-config-expo", "prettier"],
  plugins: ["react-hooks", "react-native", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ".",
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-native/no-inline-styles": "warn",
    "react/no-unescaped-entities": "off",
  },
  ignorePatterns: ["dist", ".expo", "node_modules", "e2e"],
};

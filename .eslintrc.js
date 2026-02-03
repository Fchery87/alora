module.exports = {
  root: true,
  extends: ["eslint-config-expo", "prettier"],
  plugins: ["react-hooks", "react-native", "import", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        paths: ["."],
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
    "import/namespace": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: [
    "dist",
    ".expo",
    "node_modules",
    "e2e",
    "convex/_generated",
    "webpack.config.js",
    "metro.config.js",
    "babel.config.js",
    "app.config.js",
    "tailwind.config.js",
  ],
};

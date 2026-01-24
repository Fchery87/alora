module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  specs: "e2e/**/*.test.{ts,tsx}",
  setupFilesAfterEnv: ["<rootDir>/e2e/setup.ts"],
  testMatch: ["**/__tests__/e2e/**/*.test.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: ["e2e/**/*.{ts,tsx}", "!**/node_modules/**"],
  coverageDirectory: "coverage-e2e",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.e2e.json",
    },
  },
};

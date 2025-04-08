/** @type {import('jest').Config} */
module.exports = {
  preset: "@personal-ai/config-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/app"],
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@personal-ai/(.*)$": "<rootDir>/../../packages/$1/src",
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};

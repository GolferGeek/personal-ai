/** @type {import('jest').Config} */
module.exports = {
  preset: "@personal-ai/config-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.spec.ts", "**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@personal-ai/(.*)$": "<rootDir>/../../packages/$1/src",
  },
  verbose: true,
};

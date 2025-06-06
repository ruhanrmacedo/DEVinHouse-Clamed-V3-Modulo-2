/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    globalSetup: "<rootDir>/src/__tests__/setup.ts", 
    globalTeardown: "<rootDir>/src/__tests__/teardown.ts", 
    moduleFileExtensions: ["ts", "tsx", "js"],
    testMatch: ["**/__tests__/**/*.test.ts"], 
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    coverageDirectory: "coverage",
    collectCoverageFrom: [
      "src/**/*.ts",
      "!src/server.ts",
      "!src/config/**",
      "!src/migrations/**",
    ],
  };
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFileAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  tranform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverage: true, // 커버리지 수집을 활성화
  coverageDirectory: "coverage", // 커버리지 결과를 저장할 디렉토리
  coverageReporters: ["html", "text", "lcov"], // HTML 리포트와 다른 형식들 포함
};
module.exports = createJestConfig(customJestConfig);

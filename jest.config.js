module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  setupFilesAfterEnv: ["<rootDir>/tests/unit/tests-config.js"],
  //collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,vue}",
    "!**/jest.config.js",
    "!**/babel.config.js",
    "!**/gulpfile.js",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/network-services/**",
    "!**/public/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!**/tests/**",
  ],
};

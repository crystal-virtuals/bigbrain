module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/jest.setup.cjs"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
};
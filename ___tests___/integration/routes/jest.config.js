module.exports = {
  verbose: true,
  bail: false,
  coverageDirectory: 'output/coverage/jest',
  globalSetup: './bootstrap.js',
  globalTeardown: './teardown.js',
  setupFiles: ["dotenv/config"],
};

// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you use them in your Next.js config)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/api/(.*)$': '<rootDir>/src/api/$1',
  },
  // Ignore server directories and their tests
  testPathIgnorePatterns: ['/node_modules/', '/server/', '/server_backup/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig); 
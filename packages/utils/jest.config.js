/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@personal-ai/models(.*)$': '<rootDir>/../models/src$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts'
  ]
}; 
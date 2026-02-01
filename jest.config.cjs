module.exports = {
  roots: ['<rootDir>/src/app'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
};

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/test/.coverage',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  roots: ['<rootDir>/test'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  silent: true,
  snapshotResolver: './.jest-snapshot-resolver.js'
};

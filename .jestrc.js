const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/mock.ts'],
  coverageDirectory: '<rootDir>/test/.coverage',
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  /** allows usage of tsconfig paths in spec files */
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  roots: ['<rootDir>/test'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  silent: true,
  /** changes default snapshot folder from `___snapshots___` to same folder as spec */
  snapshotResolver: './.jest-snapshot-resolver.js'
};

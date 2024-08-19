/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import type { Config } from '@jest/types';


const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  //Below lines are added to make it possible to use paths from the tsconfig.json file in UTs
  modulePaths: [compilerOptions.baseUrl],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
  roots: ["lib"],
};


const config: Config.InitialOptions = {
  // ... other configurations
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  // ... rest of your configuration
};

export default config;

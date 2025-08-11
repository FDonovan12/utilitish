const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/docs/'],
    transform: {
        ...tsJestTransformCfg,
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
            diagnostics: false,
        },
    },
    cacheDirectory: '<rootDir>/node_modules/.cache/jest',
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/docs/'],
    verbose: false,
};

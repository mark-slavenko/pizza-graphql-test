/* eslint-disable */

export default {
    clearMocks: true,
    collectCoverage: true,
    preset: 'ts-jest',
    coverageProvider: 'v8',
    globals: {
        "ts-jest": {
            "diagnostics": false,
            "tsconfig": "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
        'node'
    ],
    roots: [
        "<rootDir>/src"
    ],
    testMatch: [
        "**/*.test.ts"
    ],
    collectCoverageFrom: ['**/*.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    }
}

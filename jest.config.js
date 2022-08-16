module.exports = {
    preset: 'jest-puppeteer',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|jpg|png|svg|less)$': '<rootDir>/styleMock.js',
        'nav-(.*)-style': '<rootDir>/styleMock.js',
        // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
        uuid: require.resolve('uuid'),
    },
    transform: {
        '^.+\\.(ts|js)x?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@navikt/k9-date-utils|@navikt/k9-period-utils|@navikt/k9-array-utils|@navikt/k9-http-utils|@navikt/k9-react-components|@navikt/k9-bem-utils|@navikt/k9-form-utils)/)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    globalSetup: '<rootDir>/jest.global-setup.ts',
    testTimeout: 200000,
};

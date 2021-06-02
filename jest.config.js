module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '\\.(css|jpg|png|svg|less)$': '<rootDir>/styleMock.js',
        'nav-(.*)-style': '<rootDir>/styleMock.js',
    },
    transform: {
        '^.+\\.(ts|js)x?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@navikt/k9-date-utils|@navikt/k9-period-utils|@navikt/k9-array-utils)/)',
    ],
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
};

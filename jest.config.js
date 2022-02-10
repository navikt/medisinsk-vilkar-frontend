module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|jpg|png|svg|less)$': '<rootDir>/styleMock.js',
        'nav-(.*)-style': '<rootDir>/styleMock.js',
    },
    transform: {
        '^.+\\.(ts|js)x?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@navikt/k9-date-utils|@navikt/k9-period-utils|@navikt/k9-array-utils|@navikt/k9-http-utils|@navikt/k9-react-components|@navikt/k9-bem-utils|@navikt/k9-form-utils)/)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    roots: ['<rootDir>/src'],
};

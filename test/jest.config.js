module.exports = {
    preset: 'jest-puppeteer',
    setupFilesAfterEnv: ['./test/jest.image.ts'],
    rootDir: '../',
    roots: ['./test', './src'],
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testMatch: ['**/?(*.)+(spec|test).[t]s'],
    testPathIgnorePatterns: ['/node_modules/', 'dist', 'src'],
    testTimeout: 200000,
    globalSetup: './test/jest.global-setup.ts',
};

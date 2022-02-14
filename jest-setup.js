import '@testing-library/jest-dom';
import 'expect-puppeteer';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
    diffDirection: 'vertical',
    dumpDiffToConsole: true,
    comparisonMethod: 'ssim',
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
});

expect.extend({ toMatchImageSnapshot });

import { Period } from '../../types/Period';
import { finnHullIPeriodeTilVurdering, slåSammenSammenhengendePerioder } from '../periodUtils';

describe('slåSammenSammenhengendePerioder', () => {
    it('should handle two consecutive periods with one separate', () => {
        const periods = [
            new Period('01.01.2020', '05.01.2020'),
            new Period('06.01.2020', '10.01.2020'),
            new Period('25.01.2020', '31.01.2020'),
            new Period('01.02.2020', '05.02.2020'),
            new Period('07.02.2020', '10.02.2020'),
        ];

        const expectedResult = [
            new Period('01.01.2020', '10.01.2020'),
            new Period('25.01.2020', '05.02.2020'),
            new Period('07.02.2020', '10.02.2020'),
        ];

        const result = slåSammenSammenhengendePerioder(periods);

        expect(result).toEqual(expectedResult);
    });

    it('should handle two consecutive periods with one separate in the middle', () => {
        const periods = [
            new Period('01.01.2020', '05.01.2020'),
            new Period('06.01.2020', '10.01.2020'),
            new Period('25.01.2020', '30.01.2020'),
            new Period('01.02.2020', '05.02.2020'),
            new Period('06.02.2020', '10.02.2020'),
        ];

        const expectedResult = [
            new Period('01.01.2020', '10.01.2020'),
            new Period('25.01.2020', '30.01.2020'),
            new Period('01.02.2020', '10.02.2020'),
        ];

        const result = slåSammenSammenhengendePerioder(periods);

        expect(result).toEqual(expectedResult);
    });

    it('should handle the first period being separate', () => {
        const periods = [
            new Period('01.01.2020', '05.01.2020'),
            new Period('01.02.2020', '05.02.2020'),
            new Period('06.02.2020', '10.02.2020'),
        ];

        const expectedResult = [new Period('01.01.2020', '05.01.2020'), new Period('01.02.2020', '10.02.2020')];

        const result = slåSammenSammenhengendePerioder(periods);

        expect(result).toEqual(expectedResult);
    });

    it('should handle two separate periods', () => {
        const periods = [new Period('01.01.2020', '05.01.2020'), new Period('06.02.2020', '10.02.2020')];

        const expectedResult = [new Period('01.01.2020', '05.01.2020'), new Period('06.02.2020', '10.02.2020')];

        const result = slåSammenSammenhengendePerioder(periods);

        expect(result).toEqual(expectedResult);
    });

    it('should handle overlapping periods', () => {
        const periods = [
            new Period('01.01.2020', '07.01.2020'),
            new Period('06.01.2020', '10.01.2020'),
            new Period('16.01.2020', '20.01.2020'),
        ];

        const expectedResult = [new Period('01.01.2020', '10.01.2020'), new Period('16.01.2020', '20.01.2020')];

        const result = slåSammenSammenhengendePerioder(periods);

        expect(result).toEqual(expectedResult);
    });
});

test('finnHullIPeriodeTilVurdering', () => {
    const perioderTilVurdering = [new Period('2020-04-01', '06.04.2020'), new Period('2020-02-01', '06.02.2020')];
    const expectedHull = [new Period('2020-02-07', '2020-03-31')];
    const result = finnHullIPeriodeTilVurdering(perioderTilVurdering);

    expect(result).toEqual(expectedHull);
});

import { Period } from '../../types/Period';
import { justerPerioder } from '../vurderingsoversikt';

describe('oppdaterPerioderSomSkalVurderes', () => {
    it('should remove periods in the first list that are covered completely by one of the periods in the other list', () => {
        const perioderSomSkalVurderes = [new Period('2020-01-01', '2020-01-15')];
        const nyligVurdertePerioder = [new Period('2020-01-01', '2020-01-15')];

        const result = justerPerioder(perioderSomSkalVurderes, nyligVurdertePerioder);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('should set previous fom date to day after overlapping periods tom date if left overlap', () => {
        const perioderSomSkalVurderes = [new Period('2020-01-05', '2020-01-10')];
        const nyligVurdertePerioder = [new Period('2020-01-01', '2020-01-08')];

        const result = justerPerioder(perioderSomSkalVurderes, nyligVurdertePerioder);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(1);
        expect(result[0].fom).toBe('2020-01-09');
        expect(result[0].tom).toBe('2020-01-10');
    });

    it('should set previous tom date to day before overlapping periods fom date if right overlap', () => {
        const perioderSomSkalVurderes = [new Period('2020-01-05', '2020-01-10')];
        const nyligVurdertePerioder = [new Period('2020-01-08', '2020-01-13')];

        const result = justerPerioder(perioderSomSkalVurderes, nyligVurdertePerioder);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(1);
        expect(result[0].fom).toBe('2020-01-05');
        expect(result[0].tom).toBe('2020-01-07');
    });
});

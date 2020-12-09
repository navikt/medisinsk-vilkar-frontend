import GradAvTilsynsbehov from '../../types/GradAvTilsynsbehov';
import { Period } from '../../types/Period';
import { lagPeriodeMedTilsynsbehov } from '../periodeMedTilsynsbehov';

test('lagPeriodeMedTilsynsbehov', () => {
    const period = new Period('2020-09-10', '2020-09-15');
    const grad = GradAvTilsynsbehov.BEHOV_FOR_EN;
    const expectedResult = {
        periode: { fom: '2020-09-10', tom: '2020-09-15' },
        grad: GradAvTilsynsbehov.BEHOV_FOR_EN,
    };
    expect(lagPeriodeMedTilsynsbehov(period, grad)).toEqual(expectedResult);
});

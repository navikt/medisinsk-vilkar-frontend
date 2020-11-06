import { Period } from '../types/Period';
import GradAvTilsynsbehov from '../types/GradAvTilsynsbehov';
import PeriodeMedGradAvTilsynsbehov from '../types/PeriodeMedGradAvTilsynsbehov';

export const lagPeriodeMedTilsynsbehov = (periode: Period, grad: GradAvTilsynsbehov): PeriodeMedGradAvTilsynsbehov => {
    return {
        periode,
        grad,
    };
};

export const lagPeriodeMedBehovForEnTilsynsperson = (periode: Period): PeriodeMedGradAvTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.BEHOV_FOR_EN);
};

export const lagPeriodeMedBehovForToTilsynspersoner = (periode: Period): PeriodeMedGradAvTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.BEHOV_FOR_TO);
};

export const lagPeriodeMedIngenTilsynsbehov = (periode: Period): PeriodeMedGradAvTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.IKKE_BEHOV);
};

export const lagPeriodeMedInnleggelse = (periode: Period): PeriodeMedGradAvTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.INNLAGT);
};

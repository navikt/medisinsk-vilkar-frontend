import { Period } from '../../../types/Period';
import { isDateAfter, isDateBefore, isDateInPeriod } from '../../../util/dateUtils';

export function required(v: any) {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
}

export const isDatoUtenforPeriodeUtenTilsynsbehov = (
    date: any,
    periodeUtenTilsynsbehov: Period[]
): string | boolean => {
    if (periodeUtenTilsynsbehov.find((period) => isDateInPeriod(date, period))) {
        return 'Dato må være innenfor en periode med tilsynsbehov';
    }

    return true;
};

export const isDatoUtenforInnleggelsesperiodene = (
    date: any,
    innleggelsesperiode: Period[]
): string | boolean => {
    if (innleggelsesperiode.find((period) => isDateInPeriod(date, period))) {
        return 'Dato må være utenfor innleggelsesperioden(e)';
    }

    return true;
};

export const isDatoInnenforSøknadsperiode = (date: any, datePeriod: Period): string | boolean => {
    if (isDateInPeriod(date, datePeriod)) {
        return true;
    }

    return 'Dato må være innenfor søknadsperioden';
};

export const isDateBeforeOtherDate = (date: string, otherDate: string): string | boolean => {
    if (!otherDate || isDateBefore(date, otherDate)) {
        return true;
    }

    return 'Dato må være før til-dato';
};

export const isDateAfterOtherDate = (date: string, otherDate: string): string | boolean => {
    if (!otherDate || isDateAfter(date, otherDate)) {
        return true;
    }

    return 'Dato må være etter fra-dato';
};

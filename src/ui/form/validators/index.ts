import moment from 'moment';
import { Period } from '../../../types/Period';

export function required(v: any) {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
}

export const isDateInPeriod = (
    date: any,
    datePeriod: Period,
    includeFromAndTo?: boolean
): boolean =>
    moment(date).isBetween(
        datePeriod.fom,
        datePeriod.tom,
        undefined,
        includeFromAndTo ? '[]' : '()'
    );

export const isDatoUtenforPeriodeUtenTilsynsbehov = (
    date: any,
    periodeUtenTilsynsbehov: Period[]
): string | boolean => {
    if (periodeUtenTilsynsbehov.find((period) => isDateInPeriod(date, period, true))) {
        return 'Dato må være innenfor en periode med tilsynsbehov';
    }

    return true;
};

export const isDatoUtenforInnleggelsesperiodene = (
    date: any,
    innleggelsesperiode: Period[]
): string | boolean => {
    if (innleggelsesperiode.find((period) => isDateInPeriod(date, period, true))) {
        return 'Dato må være utenfor innleggelsesperioden(e)';
    }

    return true;
};

export const isDatoInnenforSøknadsperiode = (date: any, datePeriod: Period): string | boolean => {
    if (isDateInPeriod(date, datePeriod, true)) {
        return true;
    }

    return 'Dato må være innenfor søknadsperioden';
};

export const isDateBeforeOtherDate = (date: string, otherDate: string): string | boolean => {
    if (!otherDate || moment(date).isBefore(otherDate)) {
        return true;
    }

    return 'Dato må være før til-dato';
};

export const isDateAfterOtherDate = (date: string, otherDate: string): string | boolean => {
    if (!otherDate || moment(date).isAfter(otherDate)) {
        return true;
    }

    return 'Dato må være etter fra-dato';
};

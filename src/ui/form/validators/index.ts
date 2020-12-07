import { Period } from '../../../types/Period';
import { finnHullIPerioder } from '../../../util/periodUtils';

export function required(v: any) {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
    return true;
}

export const detErTilsynsbehovPåDatoen = (dato: any, perioderMedTilsynsbehov: Period[]): string | boolean => {
    const detErTilsynsbehovPåDato = perioderMedTilsynsbehov.some((periode) =>
        new Period(periode.fom, periode.tom).includesDate(dato)
    );
    if (detErTilsynsbehovPåDato) {
        return true;
    }
    return 'Dato må være innenfor en periode med tilsynsbehov';
};

export const datoenInngårISøknadsperioden = (dato: any, søknadsperiode: Period): string | boolean => {
    if (søknadsperiode.includesDate(dato)) {
        return true;
    }

    return 'Dato må være innenfor søknadsperioden';
};

export const detErIngenInnleggelsePåDato = (dato: any, innleggelsesperioder: Period[]): string | boolean => {
    const detErInnleggelsePåDato = innleggelsesperioder.some((periode) =>
        new Period(periode.fom, periode.tom).includesDate(dato)
    );
    if (detErInnleggelsePåDato) {
        return 'Dato må være utenfor innleggelsesperioden(e)';
    }
    return true;
};

export const datoErInnenforPerioderTilVurdering = (dato: any, perioderTilVurdering: Period[]): string | true => {
    const datoErInnenfor = perioderTilVurdering.some((period) => new Period(period.fom, period.tom).includesDate(dato));

    if (datoErInnenfor) {
        return true;
    }

    return 'Dato må være innenfor periodene som vurderes';
};

export const datoErIkkeIEtHull = (dato: any, perioder: Period[]) => {
    if (perioder.length === 1) {
        return true;
    }
    const hull: Period[] = finnHullIPerioder(perioder);
    const datoErIetHull = hull.some((period) => period.includesDate(dato));

    if (datoErIetHull) {
        return 'Dato må være innenfor søknadsperiodene';
    }
    return true;
};

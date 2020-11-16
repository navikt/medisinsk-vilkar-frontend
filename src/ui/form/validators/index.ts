import { Period } from '../../../types/Period';

export function required(v: any) {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
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

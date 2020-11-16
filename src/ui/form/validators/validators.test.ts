import { datoenInngårISøknadsperioden, detErIngenInnleggelsePåDato, detErTilsynsbehovPåDatoen, required } from '.';
import { Period } from '../../../types/Period';

test('required', () => {
    const feilmelding = 'Du må oppgi en verdi';

    expect(required('dette skal fungere')).toBe(true);
    expect(required(null)).toBe(feilmelding);
    expect(required(undefined)).toBe(feilmelding);
    expect(required('')).toBe(feilmelding);
});

test('detErTilsynsbehovPåDatoen', () => {
    const feilmelding = 'Dato må være innenfor en periode med tilsynsbehov';

    const datoMedTilsynsbehov = '2020-09-10';
    const perioderMedTilsynsbehov = [new Period('2020-09-01', '2020-09-30')];
    expect(detErTilsynsbehovPåDatoen(datoMedTilsynsbehov, perioderMedTilsynsbehov)).toBe(true);

    const datoUtenTilsynsbehov = '2020-10-01';
    expect(detErTilsynsbehovPåDatoen(datoUtenTilsynsbehov, perioderMedTilsynsbehov)).toBe(feilmelding);
});

test('datoenInngårISøknadsperioden', () => {
    const feilmelding = 'Dato må være innenfor søknadsperioden';
    const datoISøknadsperioden = '2020-09-10';
    const søknadsperiode = new Period('2020-09-01', '2020-09-30');
    expect(datoenInngårISøknadsperioden(datoISøknadsperioden, søknadsperiode)).toBe(true);

    const datoUtenforSøknadsperioden = '2020-10-01';
    expect(datoenInngårISøknadsperioden(datoUtenforSøknadsperioden, søknadsperiode)).toBe(feilmelding);
});

test('detErIngenInnleggelsePåDato', () => {
    const feilmelding = 'Dato må være utenfor innleggelsesperioden(e)';
    const datoUtenInnleggelse = '2020-09-10';
    const innleggelsesperioder = [new Period('2020-08-18', '2020-09-08')];
    expect(detErIngenInnleggelsePåDato(datoUtenInnleggelse, innleggelsesperioder)).toBe(true);

    const datoMedInnleggelse = '2020-09-05';
    expect(detErIngenInnleggelsePåDato(datoMedInnleggelse, innleggelsesperioder)).toBe(feilmelding);
});

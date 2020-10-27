import moment from 'moment';
import { Periode } from '../../../types/medisinsk-vilkår/MedisinskVilkår';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

export const isHeleSøkandsperiodenInnlegelse = (
    innleggelsesperiode: Periode,
    periodeTilVurdering: Periode
): boolean =>
    !!innleggelsesperiode?.fom &&
    !!innleggelsesperiode?.tom &&
    moment(innleggelsesperiode.fom).isSame(moment(periodeTilVurdering.fom)) &&
    moment(innleggelsesperiode.tom).isSame(moment(periodeTilVurdering.tom));

export const getResterendePerioder = (
    innleggelsesperiode: Periode,
    periodeTilVurdering: Periode
): Periode[] => {
    const perioder = [];
    const innleggelsesperiodeFom = moment(innleggelsesperiode.fom);
    const innleggelsesperiodeTom = moment(innleggelsesperiode.tom);

    const periodeTilVurderingFom = moment(periodeTilVurdering.fom);
    const periodeTilVurderingTom = moment(periodeTilVurdering.tom);
    // Dersom ingen innleggelsesperiode er definert
    if (!innleggelsesperiode || !innleggelsesperiode.fom || !innleggelsesperiode.tom) {
        perioder.push(periodeTilVurdering);
    }
    // Dersom innleggelsen dekker hele søknadsperioden
    else if (isHeleSøkandsperiodenInnlegelse(innleggelsesperiode, periodeTilVurdering)) {
        return perioder;
    }
    // Dersom innleggelsesperioden starter samme dag som søknadsperioden, men ikke varer hele søknadsperioden
    else if (
        innleggelsesperiodeFom.isSame(periodeTilVurderingFom) &&
        !innleggelsesperiodeTom.isSame(periodeTilVurderingTom)
    ) {
        const periodeEtterInnleggelse = {
            fom: innleggelsesperiodeTom.add(1, 'days').format(ISO_DATE_FORMAT),
            tom: periodeTilVurdering.tom,
        };
        perioder.push(periodeEtterInnleggelse);
    } else {
        // Dersom innleggelsesperioden ikke starter samme dag som søknadsperioden
        if (!innleggelsesperiodeFom.isSame(periodeTilVurderingFom)) {
            const periodeFørInnleggelse = {
                fom: periodeTilVurdering.fom,
                tom: innleggelsesperiodeFom.subtract(1, 'days').format(ISO_DATE_FORMAT),
            };
            perioder.push(periodeFørInnleggelse);
        }

        // Dersom innleggelsesperioden ikke varer ut søknadsperioden
        if (!innleggelsesperiodeTom.isSame(periodeTilVurderingTom)) {
            const periodeEtterInnleggelse = {
                fom: innleggelsesperiodeTom.add(1, 'days').format(ISO_DATE_FORMAT),
                tom: periodeTilVurdering.tom,
            };

            perioder.push(periodeEtterInnleggelse);
        }
    }

    return perioder;
};

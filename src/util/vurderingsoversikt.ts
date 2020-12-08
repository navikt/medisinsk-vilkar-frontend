import Vurderingsoversikt from '../types/Vurderingsoversikt';
import Vurdering from '../types/Vurdering';
import { Period } from '../types/Period';
import dayjs from 'dayjs';

export function justerPerioder(perioderSomJusteres: Period[], nyePerioder: Period[]) {
    const justertePerioder = [];

    perioderSomJusteres.forEach((periodeSomJusteres) => {
        const helePeriodenErDekket = nyePerioder.some((p) => p.covers(periodeSomJusteres));
        if (helePeriodenErDekket) {
            // hele perioden kan droppes, fordi den er overskrevet av nyePerioder
            return;
        }

        const periodeMedStartOverlapp = nyePerioder.find((vurdertPeriode) =>
            vurdertPeriode.overlapsLeft(periodeSomJusteres)
        );
        if (periodeMedStartOverlapp) {
            const nyFradato = dayjs(periodeMedStartOverlapp.tom).utc(true).add(1, 'day');
            return justertePerioder.push(new Period(nyFradato.format('YYYY-MM-DD'), periodeSomJusteres.tom));
        }

        const periodeMedSluttOverlapp = nyePerioder.find((vurdertPeriode) =>
            vurdertPeriode.overlapsRight(periodeSomJusteres)
        );
        if (periodeMedSluttOverlapp) {
            const nyTildato = dayjs(periodeMedSluttOverlapp.fom).utc(true).subtract(1, 'day');
            return justertePerioder.push(new Period(periodeSomJusteres.fom, nyTildato.format('YYYY-MM-DD')));
        }

        // ingen overlapp = perioden er ikke berørt av nyePeriode, og tas med videre
        justertePerioder.push(periodeSomJusteres);
    });

    return justertePerioder;
}

export const lagreVurderingIVurderingsoversikt = (
    nyVurdering: Vurdering,
    gammelVurderingsoversikt: Vurderingsoversikt
): Promise<Vurderingsoversikt> => {
    const { perioderSomSkalVurderes } = gammelVurderingsoversikt;

    const nyePerioderSomSkalVurderes = justerPerioder(perioderSomSkalVurderes, nyVurdering.perioder);
    const oppdaterteVurderinger = gammelVurderingsoversikt.vurderinger
        .map((vurdering) => {
            vurdering.perioder = justerPerioder(vurdering.perioder, nyVurdering.perioder);
            return vurdering;
        })
        .filter(({ perioder }) => perioder.length > 0);

    return new Promise((resolve) =>
        resolve({
            perioderSomSkalVurderes: nyePerioderSomSkalVurderes,
            vurderinger: [nyVurdering, ...oppdaterteVurderinger],
            søknadsperioder: [],
            dokumenter: gammelVurderingsoversikt.dokumenter,
        })
    );
};

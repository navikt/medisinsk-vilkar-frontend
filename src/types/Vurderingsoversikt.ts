import { Period } from './Period';
import Link from './Link';
import Vurderingselement from './Vurderingselement';
import PeriodeMedAldersflagg from './PeriodeMedAldersflagg';

export class Vurderingsoversikt {
    vurderingselementer: Vurderingselement[];

    resterendeVurderingsperioder: PeriodeMedAldersflagg[];

    resterendeValgfrieVurderingsperioder: PeriodeMedAldersflagg[];

    søknadsperioderTilBehandling: Period[];

    perioderSomKanVurderes: Period[];

    links: Link[];

    pleietrengendesFødselsdato: string;

    harPerioderDerPleietrengendeErOver18år: boolean;

    constructor(data: Partial<Vurderingsoversikt>) {
        try {
            this.perioderSomKanVurderes = data.perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom));
            this.resterendeVurderingsperioder = data.resterendeVurderingsperioder.map(
                ({ periode, pleietrengendeErOver18år }) => ({
                    periode: new Period(periode.fom, periode.tom),
                    pleietrengendeErOver18år,
                })
            );
            this.resterendeValgfrieVurderingsperioder = data.resterendeValgfrieVurderingsperioder?.map(
                ({ periode, pleietrengendeErOver18år }) => ({
                    periode: new Period(periode.fom, periode.tom),
                    pleietrengendeErOver18år,
                })
            );
            this.søknadsperioderTilBehandling = data.søknadsperioderTilBehandling.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.vurderingselementer = data.vurderingselementer.map((vurderingselement) => ({
                ...vurderingselement,
                periode: new Period(vurderingselement.periode.fom, vurderingselement.periode.tom),
            }));
            this.links = data.links;
            this.pleietrengendesFødselsdato = data.pleietrengendesFødselsdato;
            this.harPerioderDerPleietrengendeErOver18år = data.harPerioderDerPleietrengendeErOver18år;
        } catch (error) {
            throw new Error(`Processing Vurderingsoversikt\n${error}`);
        }
    }

    harPerioderÅVise() {
        return (
            this.harPerioderSomSkalVurderes() === true ||
            this.harVurdertePerioder() === true ||
            this.harValgfriePerioderSomKanVurderes() === true
        );
    }

    harIngenPerioderÅVise() {
        return (
            this.harPerioderSomSkalVurderes() === false &&
            this.harVurdertePerioder() === false &&
            this.harValgfriePerioderSomKanVurderes() === false
        );
    }

    harPerioderSomSkalVurderes() {
        return this.resterendeVurderingsperioder && this.resterendeVurderingsperioder.length > 0;
    }

    harValgfriePerioderSomKanVurderes() {
        return this.resterendeValgfrieVurderingsperioder && this.resterendeValgfrieVurderingsperioder.length > 0;
    }

    harVurdertePerioder() {
        return this.vurderingselementer && this.vurderingselementer.length > 0;
    }

    finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder(): Period[] {
        return (
            this.vurderingselementer
                .filter(({ periode }) => {
                    const vurdertPeriode = new Period(periode.fom, periode.tom);
                    const overlapperMedEnSøknadsperiode = this.resterendeVurderingsperioder.some(
                        ({ periode: { fom, tom } }) => vurdertPeriode.overlapsWith(new Period(fom, tom))
                    );
                    return overlapperMedEnSøknadsperiode;
                })
                .map(({ periode }) => periode) || []
        );
    }

    finnResterendeVurderingsperioder() {
        return this.resterendeVurderingsperioder.map((resterendePeriode) => resterendePeriode.periode);
    }

    finnResterendeValgfrieVurderingsperioder() {
        return this.resterendeValgfrieVurderingsperioder.map(
            (resterendeValgfriPeriode) => resterendeValgfriPeriode.periode
        );
    }
}

export default Vurderingsoversikt;

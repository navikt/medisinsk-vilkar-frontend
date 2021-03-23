import { Period } from './Period';
import Link from './Link';
import { Vurderingselement } from './Vurderingselement';

export class Vurderingsoversikt {
    vurderingselementer: Vurderingselement[];

    resterendeVurderingsperioder: Period[];

    søknadsperioderTilBehandling: Period[];

    perioderSomKanVurderes: Period[];

    links: Link[];

    constructor(data: Partial<Vurderingsoversikt>) {
        try {
            this.perioderSomKanVurderes = data.perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom));
            this.resterendeVurderingsperioder = data.resterendeVurderingsperioder.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.søknadsperioderTilBehandling = data.søknadsperioderTilBehandling.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.vurderingselementer = data.vurderingselementer.map((vurderingselement) => ({
                ...vurderingselement,
                periode: new Period(vurderingselement.periode.fom, vurderingselement.periode.tom),
            }));
            this.links = data.links;
        } catch (error) {
            throw new Error(`Processing Vurderingsoversikt\n${error}`);
        }
    }

    harPerioderÅVise() {
        return this.harPerioderSomSkalVurderes() === true || this.harVurdertePerioder() === true;
    }

    harIngenPerioderÅVise() {
        return this.harPerioderSomSkalVurderes() === false && this.harVurdertePerioder() === false;
    }

    harPerioderSomSkalVurderes() {
        return this.resterendeVurderingsperioder && this.resterendeVurderingsperioder.length > 0;
    }

    harVurdertePerioder() {
        return this.vurderingselementer && this.vurderingselementer.length > 0;
    }

    finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder(): Period[] {
        return (
            this.vurderingselementer
                .filter(({ periode }) => {
                    const vurdertPeriode = new Period(periode.fom, periode.tom);
                    const overlapperMedEnSøknadsperiode = this.resterendeVurderingsperioder.some(({ fom, tom }) => {
                        return vurdertPeriode.overlapsWith(new Period(fom, tom));
                    });
                    return overlapperMedEnSøknadsperiode;
                })
                .map(({ periode }) => periode) || []
        );
    }
}

export default Vurderingsoversikt;

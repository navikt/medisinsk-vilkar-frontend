import Vurderingsoversikt from '../types/Vurderingsoversikt';
import { Period } from '../types/Period';

function processVurderingsoversikt({
    perioderSomKanVurderes,
    resterendeVurderingsperioder,
    søknadsperioderTilBehandling,
    vurderingselementer,
    links,
    harGyldigSignatur,
}: Vurderingsoversikt): Promise<Vurderingsoversikt> {
    const deferred: Promise<Vurderingsoversikt> = new Promise<Vurderingsoversikt>((resolve) => {
        try {
            const vurderingsoversikt = {
                perioderSomKanVurderes: perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom)),
                resterendeVurderingsperioder: resterendeVurderingsperioder.map(({ fom, tom }) => new Period(fom, tom)),
                søknadsperioderTilBehandling: søknadsperioderTilBehandling.map(({ fom, tom }) => new Period(fom, tom)),
                vurderingselementer: vurderingselementer.map((vurderingselement) => ({
                    ...vurderingselement,
                    periode: new Period(vurderingselement.periode.fom, vurderingselement.periode.tom),
                })),
                links,
                harGyldigSignatur,
            };
            resolve(vurderingsoversikt);
        } catch (error) {
            throw new Error(`Processing Vurderingsoversikt\n${error}`);
        }
    });
    return deferred;
}

export default processVurderingsoversikt;

export const finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder = (
    vurderingsoversikt: Vurderingsoversikt
): Period[] => {
    return (
        vurderingsoversikt?.vurderingselementer
            .filter(({ periode }) => {
                const vurdertPeriode = new Period(periode.fom, periode.tom);
                const overlapperMedEnSøknadsperiode = vurderingsoversikt?.resterendeVurderingsperioder.some(
                    ({ fom, tom }) => {
                        return vurdertPeriode.overlapsWith(new Period(fom, tom));
                    }
                );
                return overlapperMedEnSøknadsperiode;
            })
            .map(({ periode }) => periode) || []
    );
};

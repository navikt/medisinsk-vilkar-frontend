import Vurderingsoversikt from '../types/Vurderingsoversikt';
import { Period } from '../types/Period';

function processVurderingsoversikt({
    perioderSomKanVurderes,
    resterendeVurderingsperioder,
    søknadsperioderTilBehandling,
    vurderingselementer,
}: Vurderingsoversikt): Vurderingsoversikt {
    return {
        perioderSomKanVurderes: perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom)),
        resterendeVurderingsperioder: resterendeVurderingsperioder.map(({ fom, tom }) => new Period(fom, tom)),
        søknadsperioderTilBehandling: søknadsperioderTilBehandling.map(({ fom, tom }) => new Period(fom, tom)),
        vurderingselementer,
    };
}

export default processVurderingsoversikt;

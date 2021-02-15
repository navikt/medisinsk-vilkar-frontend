import { Period } from './Period';
import Vurderingselement from './Vurderingselement';
import Link from './Link';

interface Vurderingsoversikt {
    vurderingselementer: Vurderingselement[];
    resterendeVurderingsperioder: Period[];
    søknadsperioderTilBehandling: Period[];
    perioderSomKanVurderes: Period[];
    links: Link[];
    harGyldigSignatur: boolean;
}

export default Vurderingsoversikt;

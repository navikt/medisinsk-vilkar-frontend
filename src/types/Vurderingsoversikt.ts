import Links from './Links';
import { Period } from './Period';
import Vurderingselement from './Vurderingselement';

interface Vurderingsoversikt {
    links: Links[];
    vurderingselementer: Vurderingselement[];
    resterendeVurderingsperioder: Period[];
    søknadsperioderTilBehandling: Period[];
    perioderSomKanVurderes: Period[];
}

export default Vurderingsoversikt;

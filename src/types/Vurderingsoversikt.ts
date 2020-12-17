import { Period } from './Period';
import Vurderingsperiode from './Vurderingsperiode';

interface Vurderingsoversikt {
    vurderingsperioder: Vurderingsperiode[];
    perioderSomSkalVurderes: Period[];
    perioderSomKanVurderes: Period[];
}

export default Vurderingsoversikt;

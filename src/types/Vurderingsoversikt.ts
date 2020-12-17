import { Period } from './Period';
import Vurderingselement from './Vurderingselement';

interface Vurderingsoversikt {
    vurderingselementer: Vurderingselement[];
    perioderSomSkalVurderes: Period[];
    perioderSomKanVurderes: Period[];
}

export default Vurderingsoversikt;

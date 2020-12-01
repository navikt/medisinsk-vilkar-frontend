import Vurdering from './Vurdering';
import { Period } from './Period';

interface Vurderingsoversikt {
    vurderinger: Vurdering[];
    perioderSomSkalVurderes: Period[];
}

export default Vurderingsoversikt;

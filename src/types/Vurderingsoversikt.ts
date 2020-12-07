import Vurdering from './Vurdering';
import { Period } from './Period';

interface Vurderingsoversikt {
    vurderinger: Vurdering[];
    perioderSomSkalVurderes: Period[];
    søknadsperioder: Period[];
}

export default Vurderingsoversikt;

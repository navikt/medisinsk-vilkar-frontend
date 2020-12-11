import Vurdering from './Vurdering';
import { Period } from './Period';
import Dokument from './Dokument';

interface Vurderingsoversikt {
    vurderinger: Vurdering[];
    perioderSomSkalVurderes: Period[];
    perioderSomKanVurderes: Period[];
    dokumenter: Dokument[];
}

export default Vurderingsoversikt;

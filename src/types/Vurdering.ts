import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';

interface Vurdering {
    id: string;
    resultat: Vurderingsresultat;
    perioder: Period[];
    begrunnelse: string;
    dokumenter: string[];
}

export default Vurdering;

import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';

interface Vurderingsperiode {
    id: string;
    resultat: Vurderingsresultat;
    periode: Period;
    gjelderForSøker: boolean;
    gjelderForAnnenPart: boolean;
}

export default Vurderingsperiode;

import Links from './Links';
import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';

interface Vurderingselement {
    id: string;
    resultat: Vurderingsresultat;
    periode: Period;
    gjelderForSøker: boolean;
    gjelderForAnnenPart: boolean;
    links: Links[];
}

export default Vurderingselement;

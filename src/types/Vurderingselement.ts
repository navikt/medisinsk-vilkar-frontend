import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';
import Link from './Link';

interface Vurderingselement {
    id: string;
    resultat: Vurderingsresultat;
    periode: Period;
    gjelderForSøker: boolean;
    gjelderForAnnenPart: boolean;
    links: Link[];
    endretIDenneBehandlingen: boolean;
}

export default Vurderingselement;

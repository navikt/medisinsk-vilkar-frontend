import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';
import Dokument from './Dokument';

interface Vurdering {
    id: string;
    resultat: Vurderingsresultat;
    perioder: Period[];
}

export interface TilsynsbehovVurdering extends Vurdering {
    begrunnelse: string;
    dokumenter: Dokument[];
}

export interface ToOmsorgspersonerVurdering extends Vurdering {
    begrunnelse: string;
    dokumenter: Dokument[];
}

export default Vurdering;

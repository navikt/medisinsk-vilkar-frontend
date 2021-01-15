import Dokument from './Dokument';
import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';
import Link from './Link';

export interface AnnenInformasjon {
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
}

export interface Vurderingsversjon {
    versjon?: string;
    tekst: string;
    resultat: Vurderingsresultat;
    perioder: Period[];
    dokumenter: Dokument[];
    links: Link[];
}

interface Vurdering {
    id: string;
    type: string;
    versjoner: Vurderingsversjon[];
    annenInformasjon: AnnenInformasjon;
}

export default Vurdering;

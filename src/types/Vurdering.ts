import Dokument from './Dokument';
import { Period } from './Period';
import PeriodeMedAldersflagg from './PeriodeMedAldersflagg';
import Vurderingsresultat from './Vurderingsresultat';

export interface AnnenInformasjon {
    resterendeVurderingsperioder: PeriodeMedAldersflagg[];
    perioderSomKanVurderes: Period[];
}

export interface Vurderingsversjon {
    versjon?: string;
    tekst: string;
    resultat: Vurderingsresultat;
    perioder: Period[];
    dokumenter: Dokument[];
}

interface Vurdering {
    id: string;
    type: string;
    versjoner: Vurderingsversjon[];
    annenInformasjon: AnnenInformasjon;
    erInnleggelsesperiode: boolean;
}

export default Vurdering;

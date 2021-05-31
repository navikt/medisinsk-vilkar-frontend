import { Period } from '@navikt/k9-period-utils';
import Dokument from './Dokument';
import Vurderingsresultat from './Vurderingsresultat';

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
}

interface Vurdering {
    id: string;
    type: string;
    versjoner: Vurderingsversjon[];
    annenInformasjon: AnnenInformasjon;
    erInnleggelsesperiode: boolean;
}

export default Vurdering;

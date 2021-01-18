import Dokument from './Dokument';
import { Period } from './Period';
import Vurderingsresultat from './Vurderingsresultat';

export default interface RequestPayload {
    behandlingUuid: string;
    perioder: Period[];
    resultat: Vurderingsresultat;
    tekst: string;
    tilknyttedeDokumenter: Dokument[];
    type: string;
    id?: string;
    versjon?: string;
}

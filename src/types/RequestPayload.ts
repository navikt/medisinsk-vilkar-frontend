import Dokument from './Dokument';
import { Period } from './Period';

export default interface RequestPayload {
    behandlingUuid: string;
    perioder?: Period[];
    resultat?: string;
    tekst?: string;
    tilknyttedeDokumenter?: Dokument[];
    type?: string;
    id?: string;
    versjon?: string;
}

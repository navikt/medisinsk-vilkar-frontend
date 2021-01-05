import { Period } from './Period';

export enum Dokumenttype {
    LEGEERKLÆRING = 'Legeerklæring',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'ANDRE_MEDISINSKE_OPPLYSNINGER',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'MANGLER_MEDISINSKE_OPPLYSNINGER',
}

export interface Dokument {
    id: string;
    name: string;
    mottatt: Date;
    location: string;
}

export interface DokumentMedMedisinskeOpplysninger extends Dokument {
    type: Dokumenttype.LEGEERKLÆRING | Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER;
    datert: Date;
    harGyldigSignatur: boolean;
    innleggelsesperioder: Period[];
}

export interface DokumentUtenMedisinskeOpplysninger extends Dokument {
    type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER;
}

export type StrukturertDokument = DokumentUtenMedisinskeOpplysninger | DokumentMedMedisinskeOpplysninger;

interface Dokumentoversikt {
    dokumenterMedMedisinskeOpplysninger: DokumentMedMedisinskeOpplysninger[];
    dokumenterUtenMedisinskeOpplysninger: DokumentUtenMedisinskeOpplysninger[];
    ustrukturerteDokumenter: Dokument[];
}

export default Dokumentoversikt;

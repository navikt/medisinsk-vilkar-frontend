export enum Dokumenttype {
    LEGEERKLÆRING = 'Legeerklæring',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'ANDRE_MEDISINSKE_OPPLYSNINGER',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'MANGLER_MEDISINSKE_OPPLYSNINGER',
}

export interface Dokument {
    id: string;
    navn: string;
    type: Dokumenttype;
    benyttet: boolean;
    annenPartErKilde: boolean;
    datert: string;
    fremhevet: boolean;
    location?: string;
}

export interface Legeerklæring extends Dokument {
    type: Dokumenttype.LEGEERKLÆRING;
    harGyldigSignatur: boolean;
}

export interface AndreMedisinskeOpplysninger extends Dokument {
    type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER;
}

type DokumentMedMedisinskeOpplysninger = Legeerklæring | AndreMedisinskeOpplysninger;

export interface DokumentUtenMedisinskeOpplysninger extends Dokument {
    type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER;
}

export type StrukturertDokument = DokumentUtenMedisinskeOpplysninger | DokumentMedMedisinskeOpplysninger;

export interface Dokumentoversikt {
    dokumenterMedMedisinskeOpplysninger: DokumentMedMedisinskeOpplysninger[];
    dokumenterUtenMedisinskeOpplysninger: DokumentUtenMedisinskeOpplysninger[];
    ustrukturerteDokumenter: Dokument[];
}

export default Dokument;

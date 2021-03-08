import Link from './Link';

export enum Dokumenttype {
    LEGEERKLÆRING = 'LEGEERKLÆRING_SYKEHUS',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'MEDISINSKE_OPPLYSNINGER',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'ANNET',
    UKLASSIFISERT = 'UKLASSIFISERT',
}

export interface Dokument {
    id: string;
    navn: string;
    type: Dokumenttype;
    benyttet: boolean;
    behandlet: boolean;
    annenPartErKilde: boolean;
    datert: string;
    fremhevet: boolean;
    links: Link[];
    mottattDato: string;
    mottattTidspunkt: string;
}

export interface Dokumentoversikt {
    dokumenter: Dokument[];
}

export default Dokument;

import Link from './Link';

export enum Dokumenttype {
    LEGEERKLÆRING = 'LEGEERKLÆRING_SYKEHUS',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'MEDISINSKE_OPPLYSNINGER',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'ANNET',
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
    location?: string;
    links: Link[];
}

export interface Dokumentoversikt {
    dokumenter: Dokument[];
}

export default Dokument;

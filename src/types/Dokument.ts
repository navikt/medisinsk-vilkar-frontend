import Link from './Link';

export enum Dokumenttype {
    LEGEERKLÆRING = 'L',
    ANDRE_MEDISINSKE_OPPLYSNINGER = 'M',
    MANGLER_MEDISINSKE_OPPLYSNINGER = 'A',
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

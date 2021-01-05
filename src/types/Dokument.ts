export enum Dokumenttype {
    LEGEERKLÆRING = 'Legeerklæring',
    ANNET = 'annet',
}

interface Dokument {
    id: string;
    navn: string;
    type: Dokumenttype;
    benyttet: boolean;
    annenPartErKilde: boolean;
    datert: Date;
    fremhevet: boolean;
    location?: string;
}

export default Dokument;

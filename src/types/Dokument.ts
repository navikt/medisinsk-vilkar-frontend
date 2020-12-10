export enum Dokumenttype {
    LEGEERKLÆRING = 'Legeerklæring',
    ANNET = 'annet',
}

interface Dokument {
    id: string;
    type: Dokumenttype;
    mottatt: Date;
    location: string;
}

export default Dokument;

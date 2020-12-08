export enum Dokumenttype {
    LEGEERKLÆRING = 'legeerklæring',
    ANNET = 'annet',
}

interface Dokument {
    id: string;
    type: Dokumenttype;
    mottatt: Date;
    location: string;
}

export default Dokument;

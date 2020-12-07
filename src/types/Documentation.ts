export enum DocumentationType {
    LEGEERKLÆRING = 'legeerklæring',
    ANNET = 'annet',
}

interface Documentation {
    id: string;
    type: DocumentationType;
}

export default Documentation;

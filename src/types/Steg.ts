export enum StegId {
    Dokument = 'dokument',
    TilsynOgPleie = 'tilsynOgPleie',
    ToOmsorgspersoner = 'toOmsorgspersoner',
}

interface Steg {
    id: StegId;
    tittel: string;
}

export const dokumentSteg: Steg = {
    id: StegId.Dokument,
    tittel: 'Dokumentasjon av sykdom',
};

export const tilsynOgPleieSteg: Steg = {
    id: StegId.TilsynOgPleie,
    tittel: 'Tilsyn og pleie',
};

export const toOmsorgspersonerSteg: Steg = {
    id: StegId.ToOmsorgspersoner,
    tittel: 'To omsorgspersoner',
};

export default Steg;

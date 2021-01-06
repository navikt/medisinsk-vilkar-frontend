interface ContainerContract {
    vurdering: string;
    onVurderingValgt: (vurdering: string) => void;
    endpoints: {
        kontinuerligTilsynOgPleie: string;
        behovForToOmsorgspersoner: string;
    };
}

export default ContainerContract;

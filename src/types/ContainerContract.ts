interface ContainerContract {
    vurdering: string;
    onVurderingValgt: (vurdering: string) => void;
    endpoints: {
        kontinuerligTilsynOgPleie: string;
        toOmsorgspersoner: string;
    };
}

export default ContainerContract;

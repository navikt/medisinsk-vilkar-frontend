interface ContainerContract {
    vurdering: string;
    onVurderingValgt: (vurdering: string) => void;
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        dokumentoversikt: string;
        dataTilVurdering: string;
    };
}

export default ContainerContract;

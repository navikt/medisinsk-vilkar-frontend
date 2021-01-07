interface ContainerContract {
    vurdering: string;
    onVurderingValgt: (vurdering: string) => void;
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        vurderingKontinuerligTilsynOgPleie: string;
        vurderingToOmsorgspersoner: string;
        dokumentoversikt: string;
        dataTilVurdering: string;
    };
}

export default ContainerContract;

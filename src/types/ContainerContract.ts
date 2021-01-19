interface ContainerContract {
    vurdering: string;
    onVurderingValgt: (vurdering: string) => void;
    httpErrorHandler: (status: number) => void;
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        hentVurdering: string;
        opprettVurdering: string;
        endreVurdering: string;
        dokumentoversikt: string;
        dataTilVurdering: string;
    };
    behandlingUuid: string;
}

export default ContainerContract;

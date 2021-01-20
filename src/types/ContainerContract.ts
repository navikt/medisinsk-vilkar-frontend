interface ContainerContract {
    vurdering: string;
    dokument: string;
    onVurderingValgt: (vurdering: string) => void;
    onDokumentValgt: (dokument: string) => void;
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        dokumentoversikt: string;
    };
    behandlingUuid: string;
}

export default ContainerContract;

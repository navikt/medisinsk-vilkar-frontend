import { HttpErrorHandler } from './HttpErrorHandler';

interface ContainerContract {
    vurdering: string;
    dokument: string;
    onVurderingValgt: (vurdering: string) => void;
    onDokumentValgt: (dokument: string) => void;
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        dokumentoversikt: string;
        innleggelsesperioder: string;
        lagreInnleggelsesperioder: string;
        diagnosekodeSearch: string;
        diagnosekoder: string;
        leggTilDiagnosekode: string;
        slettDiagnosekode: string;
        dataTilVurdering: string;
    };
    behandlingUuid: string;
    readOnly: boolean;
    onFinished: () => void;
    httpErrorHandler: HttpErrorHandler;
}

export default ContainerContract;

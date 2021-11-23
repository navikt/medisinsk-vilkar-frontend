import { HttpErrorHandler } from './HttpErrorHandler';

interface ContainerContract {
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
        status: string;
        nyeDokumenter: string;
    };
    behandlingUuid: string;
    readOnly: boolean;
    onFinished: (...args: unknown[]) => void;
    httpErrorHandler: HttpErrorHandler;
    visFortsettknapp: boolean;
}

export default ContainerContract;

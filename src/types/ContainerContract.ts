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
    };
    behandlingUuid: string;
    readOnly: boolean;
    onFinished: () => void;
    httpErrorHandler: HttpErrorHandler;
}

export default ContainerContract;

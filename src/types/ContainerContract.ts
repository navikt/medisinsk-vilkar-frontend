import BehandlingType from '../constants/BehandlingType';
import FagsakYtelseType from '../constants/FagsakYtelseType';
import { HttpErrorHandler } from './HttpErrorHandler';

interface ContainerContract {
    endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie: string;
        vurderingsoversiktBehovForToOmsorgspersoner: string;
        vurderingsoversiktLivetsSluttfase: string;
        vurderingsoversiktLangvarigSykdom: string;
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
        saksbehandlerInfo: string;
    };
    behandlingUuid: string;
    readOnly: boolean;
    onFinished: (...args: unknown[]) => void;
    httpErrorHandler: HttpErrorHandler;
    visFortsettknapp: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saksbehandlere: any;
    fagsakYtelseType?: FagsakYtelseType;
    behandlingType?: BehandlingType;
}

export default ContainerContract;

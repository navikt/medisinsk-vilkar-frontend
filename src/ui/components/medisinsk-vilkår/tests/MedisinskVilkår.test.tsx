import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as httpUtils from '@navikt/k9-http-utils';
import ContainerContext from '../../../context/ContainerContext';
import MedisinskVilkår from '../MedisinskVilkår';

jest.mock('nav-frontend-modal');

const statusEndpointMock = 'statusEndpointMock';

const vurderingsoversiktMock = {
    perioderSomKanVurderes: [],
    resterendeVurderingsperioder: [{ fom: '2028-01-01', tom: '2028-01-01' }],
    resterendeValgfrieVurderingsperioder: [],
    søknadsperioderTilBehandling: [],
    vurderingselementer: [],
    links: [],
} as any;

const httpErrorHandlerMock = () => null;
const contextWrapper = (ui) =>{
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>

        <ContainerContext.Provider
            value={
                {
                    httpErrorHandler: httpErrorHandlerMock,
                    endpoints: { status: statusEndpointMock },
                } as any
            }
        >
            {ui}
        </ContainerContext.Provider>
        </QueryClientProvider>
    );
}
const renderMedisinskVilkår = () => contextWrapper(<MedisinskVilkår />);

describe('MedisinskVilkår', () => {
    let httpGetSpy = null;

    beforeAll(() => {
        httpGetSpy = jest.spyOn(httpUtils, 'get');
    });

    const mockResolvedGetApiCall = (data) => {
        httpGetSpy.mockImplementation(() => new Promise((resolve) => resolve(data)));
    };

    it('should render spinner while getting sykdomsstegStatus, then render Infostripe with text when data has been received', async () => {
        mockResolvedGetApiCall({ manglerDiagnosekode: true });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Sykdomsvurderingen gjelder barnet og er felles for alle parter./)).toBeInTheDocument();
        });
    });

    it('should activate dokument-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerGodkjentLegeerklæring: true, dokumenter: [] });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument();
        });
    });

    it('should activate ktp-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerVurderingAvKontinuerligTilsynOgPleie: true, ...vurderingsoversiktMock });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Vurdering av tilsyn og pleie/i)).toBeInTheDocument();
        });
    });

    it('should activate to omsorgspersoner-step by default when that is the step that needs work next', async () => {
        mockResolvedGetApiCall({ manglerVurderingAvToOmsorgspersoner: true, ...vurderingsoversiktMock });
        const { getByText } = renderMedisinskVilkår();
        expect(getByText('Venter...')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText(/Vurdering av to omsorgspersoner/i)).toBeInTheDocument();
        });
    });
});

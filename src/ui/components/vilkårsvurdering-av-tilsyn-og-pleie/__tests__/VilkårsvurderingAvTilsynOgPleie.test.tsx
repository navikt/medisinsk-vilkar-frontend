import React from 'react';
import axios from 'axios';
import * as httpUtils from '@navikt/k9-http-utils';
import { act, render, fireEvent, waitFor, screen, waitForElementToBeRemoved } from '@testing-library/react';
import VilkårsvurderingAvTilsynOgPleie from '../VilkårsvurderingAvTilsynOgPleie';
import ContainerContext from '../../../context/ContainerContext';
import VurderingContext from '../../../context/VurderingContext';
import Vurderingstype from '../../../../types/Vurderingstype';

const vurderingsoversiktEndpoint = 'vurderingsoversikt-mock';
const httpErrorHandlerMock = () => null;
const cancelTokenMock = { cancelToken: 'foo' };

const contextWrapper = (ui) => {
    return render(
        <ContainerContext.Provider
            value={
                {
                    endpoints: { vurderingsoversiktKontinuerligTilsynOgPleie: vurderingsoversiktEndpoint },
                    httpErrorHandler: httpErrorHandlerMock,
                } as any
            }
        >
            <VurderingContext.Provider value={{ vurderingstype: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE }}>
                {ui}
            </VurderingContext.Provider>
        </ContainerContext.Provider>
    );
};

describe('VilkårsvurderingAvTil', () => {
    let httpGetSpy = null;

    beforeAll(() => {
        httpGetSpy = jest.spyOn(httpUtils, 'get');
        const mock = jest.spyOn(axios.CancelToken, 'source');

        mock.mockImplementation(() => {
            return {
                token: cancelTokenMock.cancelToken,
                cancel: () => null,
            } as any;
        });
        httpGetSpy.mockImplementation(() => {
            return new Promise((resolve) =>
                resolve({
                    perioderSomKanVurderes: [],
                    resterendeVurderingsperioder: [],
                    resterendeValgfrieVurderingsperioder: [],
                    søknadsperioderTilBehandling: [],
                    vurderingselementer: [],
                    links: [],
                } as any)
            );
        });
    });

    it('should make an initial http call to get vurderingsoversikt', async () => {
        const { getByText } = contextWrapper(
            <VilkårsvurderingAvTilsynOgPleie
                navigerTilNesteSteg={() => 1}
                sykdomsstegStatus={{ manglerGodkjentLegeerklæring: false } as any}
                hentSykdomsstegStatus={() => new Promise((resolve) => resolve(null))}
            />
        );
        screen.getByText(/Venter.../i);
        expect(httpGetSpy).toHaveBeenCalledWith(vurderingsoversiktEndpoint, httpErrorHandlerMock, cancelTokenMock);
        await waitFor(() => {
            expect(getByText(/Ingen perioder å vurdere/i)).toBeInTheDocument();
        });
    });
});

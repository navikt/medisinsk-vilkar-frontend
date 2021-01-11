import RequestPayload from '../src/types/RequestPayload';
import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import tilsynsbehovVurderingsoversiktMock from './mocked-data/mockedTilsynsbehovVurderingsoversikt';

export const createVurdering = (requestBody: RequestPayload) => {
    const nyVurderingId = tilsynsbehovVurderingsoversiktMock.vurderingselementer.length + 1;
    tilsynsbehovVurderingsoversiktMock.vurderingselementer.push({
        id: `${nyVurderingId}`,
        periode: requestBody.perioder[0],
        resultat: requestBody.resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
        links: [
            {
                href: `http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurdering/?vurderingId=${nyVurderingId}`,
                rel: 'sykdom-vurdering',
                requestPayload: null,
                type: 'GET',
            },
            {
                href: 'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurdering/versjon',
                rel: 'sykdom-vurdering-endring',
                requestPayload: {
                    behandlingUuid: '71738d05-02d8-4476-833b-d5071146e5cc',
                    id: null,
                    versjon: null,
                    tekst: null,
                    resultat: null,
                    perioder: [],
                    tilknyttedeDokumenter: null,
                },
                type: 'POST',
            },
        ],
    });
    tilsynsbehovVurderingsoversiktMock.resterendeVurderingsperioder = [];
    tilsynsbehovVurderingerMock.push({
        id: `${nyVurderingId}`,
        type: 'KONTINUERLIG_TILSYN_OG_PLEIE',
        versjoner: [
            {
                perioder: requestBody.perioder,
                resultat: requestBody.resultat,
                dokumenter: requestBody.tilknyttedeDokumenter,
                tekst: requestBody.tekst,
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    });
};

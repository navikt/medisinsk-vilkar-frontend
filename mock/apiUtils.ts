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
    });
    tilsynsbehovVurderingsoversiktMock.resterendeVurderingsperioder = [];
    tilsynsbehovVurderingerMock.push({
        id: `${nyVurderingId}`,
        type: requestBody.type,
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

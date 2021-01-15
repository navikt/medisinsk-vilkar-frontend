import RequestPayload from '../src/types/RequestPayload';
import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import tilsynsbehovVurderingsoversiktMock from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';
import toOmsorgspersonerVurderingerMock from './mocked-data/mockedToOmsorgspersonerVurderinger';

export const createKontinuerligTilsynVurdering = (requestBody: RequestPayload) => {
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

export const createToOmsorgspersonerVurdering = (requestBody: RequestPayload) => {
    const nyVurderingId = mockedToOmsorgspersonerVurderingsoversikt.vurderingselementer.length + 11;
    mockedToOmsorgspersonerVurderingsoversikt.vurderingselementer.push({
        id: `${nyVurderingId}`,
        periode: requestBody.perioder[0],
        resultat: requestBody.resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
    });
    mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder = [];
    toOmsorgspersonerVurderingerMock.push({
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

import RequestPayload from '../src/types/RequestPayload';
import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import tilsynsbehovVurderingsoversiktMock from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';
import toOmsorgspersonerVurderingerMock from './mocked-data/mockedToOmsorgspersonerVurderinger';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';

export const createKontinuerligTilsynVurdering = (requestBody: RequestPayload) => {
    const nyVurderingId = tilsynsbehovVurderingsoversiktMock.vurderingselementer.length + 1;
    const { type, perioder, resultat, tilknyttedeDokumenter, tekst } = requestBody;

    tilsynsbehovVurderingsoversiktMock.vurderingselementer.push({
        id: `${nyVurderingId}`,
        periode: perioder[0],
        resultat: resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
        links: createMockedVurderingselementLinks(nyVurderingId),
    });
    tilsynsbehovVurderingsoversiktMock.resterendeVurderingsperioder = [];
    tilsynsbehovVurderingerMock.push({
        id: `${nyVurderingId}`,
        type: type,
        versjoner: [
            {
                perioder: perioder,
                resultat: resultat,
                dokumenter: tilknyttedeDokumenter,
                tekst: tekst,
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
    const { type, perioder, resultat, tilknyttedeDokumenter, tekst } = requestBody;

    mockedToOmsorgspersonerVurderingsoversikt.vurderingselementer.push({
        id: `${nyVurderingId}`,
        periode: perioder[0],
        resultat: resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
        links: createMockedVurderingselementLinks(nyVurderingId),
    });
    mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder = [];
    toOmsorgspersonerVurderingerMock.push({
        id: `${nyVurderingId}`,
        type: type,
        versjoner: [
            {
                perioder: perioder,
                resultat: resultat,
                dokumenter: tilknyttedeDokumenter,
                tekst: tekst,
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    });
};

import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './mockedVurderingselementLinks';

const mockedToOmsorgspersonerVurderingsoversikt = {
    vurderingselementer: [
        {
            id: '11',
            periode: { fom: '2020-01-01', tom: '2020-01-15' },
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('11'),
        },
        {
            id: '22',
            periode: { fom: '2020-01-16', tom: '2020-01-20' },
            resultat: Vurderingsresultat.IKKE_OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('22'),
        },
    ],
    resterendeVurderingsperioder: [{ fom: '2020-01-16', tom: '2020-01-20' }],
    perioderSomKanVurderes: [
        { fom: '2020-01-01', tom: '2020-01-15' },
        { fom: '2020-01-16', tom: '2020-01-20' },
    ],
    søknadsperioderTilBehandling: [{ fom: '2020-01-16', tom: '2020-01-20' }],
    links: mockedVurderingsoversiktLinks,
};

export default mockedToOmsorgspersonerVurderingsoversikt;

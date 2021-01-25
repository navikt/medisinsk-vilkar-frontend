import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './mockedVurderingselementLinks';

const tilsynsbehovVurderingsoversiktMock = {
    vurderingselementer: [
        {
            id: '1',
            periode: { fom: '2020-01-01', tom: '2020-01-15' },
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
            links: createMockedVurderingselementLinks('1'),
        },
    ],
    resterendeVurderingsperioder: [
        // { fom: '2020-01-16', tom: '2020-01-20' }
    ],
    perioderSomKanVurderes: [
        { fom: '2020-01-01', tom: '2020-01-15' },
        { fom: '2020-01-16', tom: '2020-01-20' },
    ],
    søknadsperioderTilBehandling: [],
    links: mockedVurderingsoversiktLinks,
};

export default tilsynsbehovVurderingsoversiktMock;

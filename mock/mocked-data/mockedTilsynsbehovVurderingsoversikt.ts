import Vurderingsresultat from '../../src/types/Vurderingsresultat';

const tilsynsbehovVurderingsoversiktMock = {
    vurderingselementer: [
        {
            id: '1',
            periode: { fom: '2020-01-01', tom: '2020-01-15' },
            resultat: Vurderingsresultat.INNVILGET,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
        },
    ],
    resterendeVurderingsperioder: [{ fom: '2020-01-16', tom: '2020-01-20' }],
    perioderSomKanVurderes: [
        { fom: '2020-01-01', tom: '2020-01-15' },
        { fom: '2020-01-16', tom: '2020-01-20' },
    ],
    søknadsperioderTilBehandling: [],
};

export default tilsynsbehovVurderingsoversiktMock;

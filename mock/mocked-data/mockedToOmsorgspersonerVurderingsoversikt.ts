import Vurderingsresultat from '../../src/types/Vurderingsresultat';

const mockedToOmsorgspersonerVurderingsoversikt = {
    vurderingselementer: [
        {
            id: '1',
            periode: { fom: '2020-01-01', tom: '2020-01-15' },
            resultat: Vurderingsresultat.OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
        },
        {
            id: '2',
            periode: { fom: '2020-01-16', tom: '2020-01-20' },
            resultat: Vurderingsresultat.IKKE_OPPFYLT,
            gjelderForSøker: false,
            gjelderForAnnenPart: true,
        },
    ],
    resterendeVurderingsperioder: [{ fom: '2020-01-16', tom: '2020-01-20' }],
    perioderSomKanVurderes: [
        { fom: '2020-01-01', tom: '2020-01-15' },
        { fom: '2020-01-16', tom: '2020-01-20' },
    ],
    søknadsperioderTilBehandling: [{ fom: '2020-01-16', tom: '2020-01-20' }],
};

export default mockedToOmsorgspersonerVurderingsoversikt;

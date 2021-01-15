import Vurdering from '../../src/types/Vurdering';
import { Period } from '../../src/types/Period';
import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';
import createMockedVurderingselementLinks from './mockedVurderingselementLinks';

const tilsynsbehovVurderingerMock: Vurdering[] = [
    {
        id: '1',
        type: 'KONTINUERLIG_TILSYN_OG_PLEIE',
        versjoner: [
            {
                perioder: [new Period('2020-01-01', '2020-01-15')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
                links: createMockedVurderingselementLinks('1'),
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
];

export default tilsynsbehovVurderingerMock;

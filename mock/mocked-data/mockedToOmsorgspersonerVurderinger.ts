import Vurdering from '../../src/types/Vurdering';
import { Period } from '../../src/types/Period';
import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';
import createMockedVurderingselementLinks from './mockedVurderingselementLinks';

const toOmsorgspersonerVurderingerMock: Vurdering[] = [
    {
        id: '11',
        type: 'TO_OMSORGSPERSONER',
        versjoner: [
            {
                perioder: [new Period('2020-01-01', '2020-01-15')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
                links: createMockedVurderingselementLinks('11'),
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
    {
        id: '22',
        type: 'TO_OMSORGSPERSONER',
        versjoner: [
            {
                perioder: [new Period('2020-01-16', '2020-01-20')],
                resultat: Vurderingsresultat.IKKE_OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det ikke behov',
                links: createMockedVurderingselementLinks('22'),
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
];

export default toOmsorgspersonerVurderingerMock;

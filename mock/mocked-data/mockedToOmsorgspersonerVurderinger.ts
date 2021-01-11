import Vurdering from '../../src/types/Vurdering';
import { Period } from '../../src/types/Period';
import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';

const toOmsorgspengerVurderingerMock: Vurdering[] = [
    {
        id: '1',
        type: 'TO_OMSORGSPERSONER',
        versjoner: [
            {
                perioder: [new Period('2020-01-01', '2020-01-15')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
    {
        id: '2',
        type: 'TO_OMSORGSPERSONER',
        versjoner: [
            {
                perioder: [new Period('2020-01-16', '2020-01-20')],
                resultat: Vurderingsresultat.IKKE_OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det ikke behov',
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
];

export default toOmsorgspengerVurderingerMock;

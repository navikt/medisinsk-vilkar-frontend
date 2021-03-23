import Vurdering from '../../src/types/Vurdering';
import { Period } from '../../src/types/Period';
import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';
import Vurderingstype from '../../src/types/Vurderingstype';

const toOmsorgspersonerVurderingerMock: Vurdering[] = [
    {
        id: '11',
        type: Vurderingstype.TO_OMSORGSPERSONER,
        versjoner: [
            {
                perioder: [new Period('2022-02-01', '2020-02-15')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
        erInnleggelsesperiode: false,
    },
    {
        id: '22',
        type: Vurderingstype.TO_OMSORGSPERSONER,
        versjoner: [
            {
                perioder: [new Period('2022-01-20', '2022-01-31')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det ikke behov',
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
        erInnleggelsesperiode: true,
    },
    {
        id: '33',
        type: Vurderingstype.TO_OMSORGSPERSONER,
        versjoner: [
            {
                perioder: [new Period('2022-01-15', '2022-01-19')],
                resultat: Vurderingsresultat.IKKE_OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det ikke behov',
            },
        ],
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
        erInnleggelsesperiode: true,
    },
];

export default toOmsorgspersonerVurderingerMock;

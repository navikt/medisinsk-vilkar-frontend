import { Period } from '@navikt/k9-period-utils';
import Vurdering from '../../src/types/Vurdering';
import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';
import Vurderingstype from '../../src/types/Vurderingstype';

const tilsynsbehovVurderingerMock: Vurdering[] = [
    {
        id: '1',
        type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
        versjoner: [
            {
                perioder: [new Period('2022-02-01', '2022-02-15')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
            },
        ],
        erInnleggelsesperiode: false,
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
    {
        id: '2',
        type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
        versjoner: [
            {
                perioder: [new Period('2022-01-20', '2022-01-31')],
                resultat: Vurderingsresultat.OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
            },
        ],
        erInnleggelsesperiode: true,
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
    {
        id: '3',
        type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
        versjoner: [
            {
                perioder: [new Period('2022-01-15', '2022-01-19')],
                resultat: Vurderingsresultat.IKKE_OPPFYLT,
                dokumenter: mockedDokumentliste,
                tekst: 'Fordi her er det behov',
            },
        ],
        erInnleggelsesperiode: true,
        annenInformasjon: {
            resterendeVurderingsperioder: [],
            perioderSomKanVurderes: [],
        },
    },
];

export default tilsynsbehovVurderingerMock;

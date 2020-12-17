import { Period } from '../types/Period';
import Vurdering, { ToOmsorgspersonerVurdering } from '../types/Vurdering';
import Vurderingselement from '../types/Vurderingselement';
import Vurderingsresultat from '../types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';

export const genereltTilsynsbehovVurderingselementerMock: Vurderingselement[] = [
    {
        id: '1',
        periode: new Period('2020-01-01', '2020-01-15'),
        resultat: Vurderingsresultat.INNVILGET,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
    },
];

export const toSøkereMedTilsynsbehovVurderingselementerMock: Vurderingselement[] = [
    {
        id: '1',
        periode: new Period('2020-01-01', '2020-01-15'),
        resultat: Vurderingsresultat.INNVILGET,
        gjelderForSøker: false,
        gjelderForAnnenPart: true,
    },
    {
        id: '2',
        periode: new Period('2020-01-16', '2020-01-20'),
        resultat: Vurderingsresultat.INNVILGET,
        gjelderForSøker: false,
        gjelderForAnnenPart: true,
    },
];

export const toSøkereMedTilsynsbehovVurderingerMock: ToOmsorgspersonerVurdering[] = [
    {
        id: '1',
        perioder: [new Period('2020-01-01', '2020-01-15')],
        resultat: Vurderingsresultat.INNVILGET,
        dokumenter: mockedDokumentliste,
        begrunnelse: 'Fordi her er det behov',
    },
    {
        id: '2',
        perioder: [new Period('2020-01-16', '2020-01-20')],
        resultat: Vurderingsresultat.INNVILGET,
        dokumenter: mockedDokumentliste,
        begrunnelse: 'Fordi her er det behov',
    },
];

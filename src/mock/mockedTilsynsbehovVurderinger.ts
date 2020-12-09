import Vurdering from '../types/Vurdering';
import { Period } from '../types/Period';
import Vurderingsresultat from '../types/Vurderingsresultat';

export const genereltTilsynsbehovVurderingerMock: Vurdering[] = [
    {
        id: '1',
        perioder: [new Period('2020-01-01', '2020-01-15')],
        resultat: Vurderingsresultat.INNVILGET,
        begrunnelse: 'Fordi her er det behov',
        dokumenter: ['2', '3'],
    },
];

export const toSøkereMedTilsynsbehovVurderingerMock: Vurdering[] = [
    {
        id: '1',
        perioder: [new Period('2020-01-01', '2020-01-15')],
        resultat: Vurderingsresultat.INNVILGET,
        begrunnelse: 'Fordi her er det behov',
        dokumenter: ['2', '3'],
    },
    {
        id: '2',
        perioder: [new Period('2020-01-16', '2020-01-20')],
        resultat: Vurderingsresultat.INNVILGET,
        begrunnelse: 'Fordi her er det behov',
        dokumenter: ['2', '3'],
    },

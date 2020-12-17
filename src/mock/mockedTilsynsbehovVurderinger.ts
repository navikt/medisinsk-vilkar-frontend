import { Period } from '../types/Period';
import Vurderingsperiode from '../types/Vurderingsperiode';
import Vurderingsresultat from '../types/Vurderingsresultat';

export const genereltTilsynsbehovVurderingerMock: Vurderingsperiode[] = [
    {
        id: '1',
        periode: new Period('2020-01-01', '2020-01-15'),
        resultat: Vurderingsresultat.INNVILGET,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
    },
];

export const toSøkereMedTilsynsbehovVurderingerMock: Vurderingsperiode[] = [
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

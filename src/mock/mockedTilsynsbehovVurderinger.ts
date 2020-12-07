import Vurdering from '../types/Vurdering';
import { Period } from '../types/Period';
import Vurderingsresultat from '../types/Vurderingsresultat';

const genereltTilsynsbehovVurderingerMock: Vurdering[] = [
    {
        id: '1',
        perioder: [new Period('2020-01-01', '2020-01-15')],
        resultat: Vurderingsresultat.INNVILGET,
        begrunnelse: 'Fordi her er det behov',
    },
];

export default genereltTilsynsbehovVurderingerMock;

import Vurdering from '../types/Vurdering';
import { Period } from '../types/Period';
import Vurderingsresultat from '../types/Vurderingsresultat';

const toOmsorgspersonerVurderinger: Vurdering[] = [
    {
        id: '1',
        perioder: [new Period('2020-01-01', '2020-01-15'), new Period('2020-01-16', '2020-01-31')],
        resultat: Vurderingsresultat.INNVILGET,
        begrunnelse: 'Fordi her er det behov',
        dokumenter: ['1'],
    },
    {
        id: '2',
        perioder: [new Period('2020-01-20', '2020-02-15')],
        resultat: Vurderingsresultat.AVSLÅTT,
        begrunnelse: 'Fordi her er det ikke behov',
        dokumenter: ['2'],
    },
];

export default toOmsorgspersonerVurderinger;

import genereltTilsynsbehovVurderingerMock from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';

export default {
    vurderinger: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-01-16', '2020-01-20'), new Period('2020-01-25', '2020-01-31')],
    søknadsperioder: [new Period('2020-01-16', '2020-01-20'), new Period('2020-01-25', '2020-01-31')],
};

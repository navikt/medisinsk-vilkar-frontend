import genereltTilsynsbehovVurderingerMock from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';

export default {
    vurderinger: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-02-10', '2020-02-20'), new Period('2020-02-15', '2020-02-25')],
    søknadsperioder: [new Period('2020-02-01', '2020-02-29'), new Period('2020-04-01', '2020-04-30')],
};

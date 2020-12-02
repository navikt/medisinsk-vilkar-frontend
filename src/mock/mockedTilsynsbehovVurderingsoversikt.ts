import genereltTilsynsbehovVurderingerMock from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';

export default {
    vurderinger: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-02-10', '2020-02-20'), new Period('2020-02-15', '2020-02-25')],
};

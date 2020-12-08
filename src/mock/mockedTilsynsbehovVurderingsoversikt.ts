import genereltTilsynsbehovVurderingerMock from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';
import mockedDokumentliste from './mockedDokumentliste';

export default {
    vurderinger: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-01-25', '2020-01-31')],
    søknadsperioder: [new Period('2020-01-01', '2020-01-15'), new Period('2020-01-25', '2020-01-31')],
    dokumenter: mockedDokumentliste,
};

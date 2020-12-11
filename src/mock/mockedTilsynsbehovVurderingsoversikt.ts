import { genereltTilsynsbehovVurderingerMock } from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';
import mockedDokumentliste from './mockedDokumentliste';
import Vurderingsoversikt from '../types/Vurderingsoversikt';

const tilsynsbehovVurderingsoversiktMock: Vurderingsoversikt = {
    vurderinger: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-01-16', '2020-01-20')],
    perioderSomKanVurderes: [new Period('2020-01-01', '2020-01-15'), new Period('2020-01-16', '2020-01-20')],
    dokumenter: mockedDokumentliste,
};

export default tilsynsbehovVurderingsoversiktMock;

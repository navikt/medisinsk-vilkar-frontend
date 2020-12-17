import { Period } from '../types/Period';
import Vurderingsoversikt from '../types/Vurderingsoversikt';
import { genereltTilsynsbehovVurderingerMock } from './mockedTilsynsbehovVurderinger';

const tilsynsbehovVurderingsoversiktMock: Vurderingsoversikt = {
    vurderingsperioder: genereltTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-01-16', '2020-01-20')],
    perioderSomKanVurderes: [new Period('2020-01-01', '2020-01-15'), new Period('2020-01-16', '2020-01-20')],
};

export default tilsynsbehovVurderingsoversiktMock;

import { Period } from '../types/Period';
import Vurderingsoversikt from '../types/Vurderingsoversikt';
import { toSøkereMedTilsynsbehovVurderingerMock } from './mockedTilsynsbehovVurderinger';

const mockedToOmsorgspersonerVurderingsoversikt: Vurderingsoversikt = {
    vurderingsperioder: toSøkereMedTilsynsbehovVurderingerMock,
    perioderSomSkalVurderes: [new Period('2020-01-16', '2020-01-20')],
    perioderSomKanVurderes: [new Period('2020-01-01', '2020-01-15'), new Period('2020-01-16', '2020-01-20')],
};

export default mockedToOmsorgspersonerVurderingsoversikt;

import {
    genereltTilsynsbehovVurderingerMock,
    toSøkereMedTilsynsbehovVurderingerMock,
} from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';
import mockedDokumentliste from './mockedDokumentliste';

export default [
    {
        vurderinger: genereltTilsynsbehovVurderingerMock,
        perioderSomSkalVurderes: [new Period('2020-01-16', '2020-01-20')],
        søknadsperioder: [new Period('2020-01-16', '2020-01-20')],
        dokumenter: mockedDokumentliste,
    },
    {
        vurderinger: toSøkereMedTilsynsbehovVurderingerMock,
        perioderSomSkalVurderes: [new Period('2020-01-21', '2020-02-04')],
        søknadsperioder: [new Period('2020-01-21', '2020-02-04')],
        dokumenter: mockedDokumentliste,
    },
];

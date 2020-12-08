import toOmsorgspersonerVurderinger from './mockedTilsynsbehovVurderinger';
import { Period } from '../types/Period';
import mockedDokumentliste from './mockedDokumentliste';

export default {
    vurderinger: toOmsorgspersonerVurderinger,
    perioderSomSkalVurderes: [new Period('2020-02-10', '2020-02-20')],
    dokumenter: mockedDokumentliste,
};

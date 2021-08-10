import { Dokument } from '../types/Dokument';
import {
    StrukturerDokumentFormFieldName as FieldName,
    StrukturerDokumentFormState,
} from '../types/StrukturerDokumentFormState';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] =>
    alleDokumenter.filter((dokument) => benyttedeDokumentIder.includes(dokument.id));

export const lagStrukturertDokument = (formState: StrukturerDokumentFormState, dokument: Dokument): Dokument => ({
    ...dokument,
    type: formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER],
    datert: formState[FieldName.DATERT],
    duplikatAvId:
        formState[FieldName.DUPLIKAT_DOKUMENT_ID] === 'ikkeDuplikat' ? null : formState[FieldName.DUPLIKAT_DOKUMENT_ID],
});

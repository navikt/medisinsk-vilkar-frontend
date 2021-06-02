import { Dokument } from '../types/Dokument';
import {
    StrukturerDokumentFormFieldName as FieldName,
    StrukturerDokumentFormState,
} from '../types/StrukturerDokumentFormState';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] => {
    return alleDokumenter.filter((dokument) => {
        return benyttedeDokumentIder.includes(dokument.id);
    });
};

export const lagStrukturertDokument = (formState: StrukturerDokumentFormState, dokument: Dokument): Dokument => {
    return {
        ...dokument,
        type: formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER],
        datert: formState[FieldName.DATERT],
    };
};

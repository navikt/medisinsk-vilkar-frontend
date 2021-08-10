import { Dokumenttype } from './Dokument';

export enum StrukturerDokumentFormFieldName {
    INNEHOLDER_MEDISINSKE_OPPLYSNINGER = 'inneholderMedisinskeOpplysninger',
    DATERT = 'datert',
    DUPLIKAT_DOKUMENT_ID = 'duplikatDokumentId',
}

export interface StrukturerDokumentFormState {
    [StrukturerDokumentFormFieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]?: Dokumenttype;
    [StrukturerDokumentFormFieldName.DATERT]: string;
    [StrukturerDokumentFormFieldName.DUPLIKAT_DOKUMENT_ID]: string;
}

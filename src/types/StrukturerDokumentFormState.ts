import { Dokumenttype } from './Dokument';

export enum StrukturerDokumentFormFieldName {
    INNEHOLDER_MEDISINSKE_OPPLYSNINGER = 'inneholderMedisinskeOpplysninger',
    DATERT = 'datert',
}

export interface StrukturerDokumentFormState {
    [StrukturerDokumentFormFieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]?: Dokumenttype;
    [StrukturerDokumentFormFieldName.DATERT]: string;
}

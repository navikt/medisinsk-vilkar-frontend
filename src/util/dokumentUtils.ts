import { Dokument, Dokumenttype } from '../types/Dokument';
import { ikkeDuplikatValue } from '../ui/components/strukturer-dokument-form/StrukturerDokumentForm';
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
        formState[FieldName.DUPLIKAT_AV_ID] === ikkeDuplikatValue ? null : formState[FieldName.DUPLIKAT_AV_ID],
});

export const renderDokumenttypeText = (dokumenttype: Dokumenttype): string => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return 'Sykehus/spesialist.';
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre med. oppl.';
    }
    if (dokumenttype === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
        return 'Mangler med. oppl.';
    }
    return null;
};

import { Dokument, StrukturertDokument } from '../types/Dokument';
import {
    FieldName,
    StrukturerDokumentFormState,
} from '../ui/components/strukturer-dokument-form/StrukturerDokumentForm';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] => {
    return alleDokumenter.filter((dokument) => {
        return benyttedeDokumentIder.includes(dokument.id);
    });
};

export const lagStrukturertDokument = (
    formState: StrukturerDokumentFormState,
    dokument: Dokument
): StrukturertDokument => {
    return {
        type: formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER],
        datert: formState[FieldName.DATERT],
        harGyldigSignatur: formState[FieldName.SIGNERT_AV_SYKEHUSLEGE_ELLER_LEGE_I_SPESIALISTHELSETJENESTEN] === true,
        ...dokument,
    };
};

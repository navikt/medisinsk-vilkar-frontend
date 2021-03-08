import { Dokument } from '../types/Dokument';
import {
    FieldName,
    StrukturerDokumentFormState,
} from '../ui/components/strukturer-dokument-form/StrukturerDokumentForm';
import { dateFromString } from './dateUtils';

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

export const sorterDokumenter = (dokumenter: Dokument[]): Dokument[] =>
    dokumenter.sort((dok1, dok2) => {
        const dok1Date = dateFromString(dok1.datert);
        const dok2Date = dateFromString(dok2.datert);
        if (dok1Date.isBefore(dok2Date)) {
            return 1;
        }
        if (dok2Date.isBefore(dok1Date)) {
            return -1;
        }
        return 0;
    });

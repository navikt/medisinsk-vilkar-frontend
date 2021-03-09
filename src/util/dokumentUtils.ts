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

export const sorterDokumenter = (dok1: Dokument, dok2: Dokument): number => {
    const dok1Date = dateFromString(dok1.mottattTidspunkt);
    const dok2Date = dateFromString(dok2.mottattTidspunkt);
    if (dok1Date.isBefore(dok2Date)) {
        return 1;
    }
    if (dok2Date.isBefore(dok1Date)) {
        return -1;
    }
    return 0;
};

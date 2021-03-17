import { dateFromString } from '../util/dateUtils';
import Dokument, { Dokumenttype } from './Dokument';

const dokumentSorter = (dok1: Dokument, dok2: Dokument): number => {
    const dok1Date = dateFromString(dok1.datert || dok1.mottattTidspunkt);
    const dok2Date = dateFromString(dok2.datert || dok2.mottattTidspunkt);
    if (dok1Date.isBefore(dok2Date)) {
        return 1;
    }
    if (dok2Date.isBefore(dok1Date)) {
        return -1;
    }
    return 0;
};

export class Dokumentoversikt {
    alleDokumenter: Dokument[];

    strukturerteDokumenter: Dokument[];

    ustrukturerteDokumenter: Dokument[];

    constructor(dokumenter: Dokument[]) {
        this.alleDokumenter = dokumenter;
        this.strukturerteDokumenter = dokumenter
            .filter(({ type }) => type !== Dokumenttype.UKLASSIFISERT)
            .sort(dokumentSorter);
        this.ustrukturerteDokumenter = dokumenter
            .filter(({ type }) => type === Dokumenttype.UKLASSIFISERT)
            .sort(dokumentSorter);
    }

    harGyldigSignatur() {
        return this.strukturerteDokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    }

    harDokumenter() {
        return this.strukturerteDokumenter.length > 0 || this.ustrukturerteDokumenter.length > 0;
    }
}

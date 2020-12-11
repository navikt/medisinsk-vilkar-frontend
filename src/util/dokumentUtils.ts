import Dokument from '../types/Dokument';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] => {
    return alleDokumenter.filter((dokument) => {
        return benyttedeDokumentIder.includes(dokument.id);
    });
};

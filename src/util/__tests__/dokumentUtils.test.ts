import dayjs from 'dayjs';
import Dokument, { Dokumenttype } from '../../types/Dokument';
import { finnBenyttedeDokumenter } from '../dokumentUtils';

const datert = dayjs().toDate().toISOString();

describe('dokumentUtils', () => {
    let result: Dokument[] = [];

    const dokumenter: Dokument[] = [
        {
            id: '1',
            type: Dokumenttype.LEGEERKLÆRING,
            datert,
            navn: 'foo',
            fremhevet: false,
            annenPartErKilde: false,
            benyttet: false,
            behandlet: false,
            links: [],
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
        },
        {
            id: '2',
            type: Dokumenttype.LEGEERKLÆRING,
            datert,
            navn: 'foo',
            fremhevet: false,
            annenPartErKilde: false,
            benyttet: false,
            behandlet: false,
            links: [],
            mottattDato: '2021-03-06',
            mottattTidspunkt: '2021-03-06T10:23:13.309267',
        },
        {
            id: '3',
            type: Dokumenttype.LEGEERKLÆRING,
            datert,
            navn: 'foo',
            fremhevet: false,
            annenPartErKilde: false,
            benyttet: false,
            behandlet: false,
            links: [],
            mottattDato: '2021-03-07',
            mottattTidspunkt: '2021-03-07T10:23:13.309267',
        },
    ];

    beforeAll(() => {
        const valgteDokumentIder: string[] = ['1', '2', '4'];
        result = finnBenyttedeDokumenter(valgteDokumentIder, dokumenter);
    });

    it('should return all documents that are benyttet', () => {
        expect(result).toContain(dokumenter[0]);
        expect(result).toContain(dokumenter[1]);
    });

    it('should not return any documents that are not benyttet', () => {
        expect(result).not.toContain(dokumenter[2]);
    });

    it('should not return any documents that are benyttet but is not contained in the list of documents', () => {
        expect(result.some((dokument) => dokument.id === '4')).toBe(false);
    });
});

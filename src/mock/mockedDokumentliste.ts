import dayjs from 'dayjs';
import Dokument, { Dokumenttype } from '../types/Dokument';

const mockedDokumentliste: Dokument[] = [
    { id: '1', type: Dokumenttype.LEGEERKLÆRING, mottatt: dayjs('01-16-2020').utc(true).toDate(), location: '#' },
    {
        id: '2',
        type: Dokumenttype.LEGEERKLÆRING,
        mottatt: dayjs('01-01-2020').utc(true).toDate(),
        location: '#',
    },
];

export default mockedDokumentliste;

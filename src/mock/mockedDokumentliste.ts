import dayjs from 'dayjs';
import Dokument, { Dokumenttype } from '../types/Dokument';

const mockedDokumentliste: Dokument[] = [
    { id: '1', type: Dokumenttype.LEGEERKLÆRING, mottatt: dayjs().utc(true).toDate(), location: '#' },
    {
        id: '2',
        type: Dokumenttype.LEGEERKLÆRING,
        mottatt: dayjs().utc(true).subtract(1, 'day').toDate(),
        location: '#',
    },
    {
        id: '3',
        type: Dokumenttype.LEGEERKLÆRING,
        mottatt: dayjs().utc(true).subtract(2, 'day').toDate(),
        location: '#',
    },
];

export default mockedDokumentliste;

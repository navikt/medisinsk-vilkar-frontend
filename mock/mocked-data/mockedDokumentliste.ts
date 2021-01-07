import dayjs from 'dayjs';
import { Dokumenttype } from '../../src/types/Dokument';

export default [
    {
        id: '1',
        type: Dokumenttype.LEGEERKLÆRING,
        datert: dayjs('01-16-2020').utc(true).toDate(),
        navn: 'Foobar-lala.pdf',
        benyttet: true,
        annenPartErKilde: false,
        fremhevet: true,
        location: '#',
    },
    {
        id: '2',
        type: Dokumenttype.LEGEERKLÆRING,
        datert: dayjs('01-01-2020').utc(true).toDate(),
        navn: 'Foobar-haha.pdf',
        benyttet: true,
        annenPartErKilde: false,
        fremhevet: true,
        location: '#',
    },
];

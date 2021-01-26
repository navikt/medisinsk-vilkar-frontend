import dayjs from 'dayjs';
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

export default [
    {
        id: '1',
        type: Dokumenttype.LEGEERKLÆRING,
        datert: dayjs('01-16-2020').utc(true).toISOString(),
        navn: 'Foobar-lala.pdf',
        benyttet: true,
        annenPartErKilde: false,
        fremhevet: true,
        behandlet: true,
        location: '#',
        links: createMockedDokumentelementLinks('1'),
    },
    {
        id: '2',
        type: Dokumenttype.LEGEERKLÆRING,
        datert: dayjs('01-01-2020').utc(true).toISOString(),
        navn: 'Foobar-haha.pdf',
        benyttet: true,
        annenPartErKilde: true,
        fremhevet: true,
        behandlet: true,
        location: '#',
        links: createMockedDokumentelementLinks('2'),
    },
];

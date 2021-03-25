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
        links: createMockedDokumentelementLinks('1'),
        mottattDato: '2021-03-05',
        mottattTidspunkt: '2021-03-05T10:23:13.309267',
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
        links: createMockedDokumentelementLinks('2'),
        mottattDato: '2021-03-06',
        mottattTidspunkt: '2021-03-06T10:23:13.309267',
    },
];

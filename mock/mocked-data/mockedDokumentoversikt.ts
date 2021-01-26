import dayjs from 'dayjs';
import { Dokumentoversikt, Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

const mockedDokumentoversikt: Dokumentoversikt = {
    dokumenter: [
        {
            id: '2',
            navn: 'Dokument 2',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            location: '#blahblah',
            datert: dayjs().toDate().toISOString(),
            links: createMockedDokumentelementLinks('2'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
        },
        {
            id: '3',
            navn: 'Dokument 3',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            location: '#blahblah',
            datert: dayjs().toDate().toISOString(),
            links: createMockedDokumentelementLinks('3'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
        },
        {
            id: '4',
            navn: 'Dokument 4',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().toDate().toISOString(),
            location: '#blahblah',
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
        },
        {
            id: '1',
            navn: 'Dokument 1',
            type: undefined,
            datert: dayjs().toDate().toISOString(),
            location: '#blahblah',
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: false,
        },
    ],
};
export default mockedDokumentoversikt;

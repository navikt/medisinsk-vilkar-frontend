import dayjs from 'dayjs';
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';
import { DokumentoversiktResponse } from '../../src/types/DokumentoversiktResponse';

const mockedDokumentoversikt: DokumentoversiktResponse = {
    dokumenter: [
        {
            id: '2',
            navn: 'Dokument 2',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('2'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
        },
        {
            id: '3',
            navn: 'Dokument 3',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('3'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
        },
        {
            id: '4',
            navn: 'Dokument 4',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
        },
        {
            id: '1',
            navn: 'Dokument 1',
            type: Dokumenttype.UKLASSIFISERT,
            datert: dayjs().format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: false,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
        },
    ],
};
export default mockedDokumentoversikt;

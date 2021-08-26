import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

const mockedDokumentoversikt = {
    dokumenter: [
        {
            id: '2',
            navn: 'Dokument 2',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().utc(true).format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('2'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
            duplikater: ['3'],
            duplikatAvId: null,
        },
        {
            id: '4',
            navn: 'Dokument 4',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().utc(true).format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: true,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
            duplikater: [],
            duplikatAvId: null,
        },
        {
            id: '1',
            navn: 'Dokument 1',
            type: Dokumenttype.UKLASSIFISERT,
            datert: dayjs().utc(true).format('YYYY-MM-DD'),
            links: createMockedDokumentelementLinks('4'),
            benyttet: true,
            annenPartErKilde: false,
            fremhevet: false,
            behandlet: false,
            mottattDato: '2021-03-05',
            mottattTidspunkt: '2021-03-05T10:23:13.309267',
            duplikater: [],
            duplikatAvId: null,
        },

    ],
};
export default mockedDokumentoversikt;

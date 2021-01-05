import dayjs from 'dayjs';
import { DokumentMedMedisinskeOpplysninger, Dokumenttype } from '../types/Dokument';

const mockedDokumentliste: DokumentMedMedisinskeOpplysninger[] = [
    {
        id: '1',
        type: Dokumenttype.LEGEERKLÆRING,
        mottatt: dayjs('01-16-2020').utc(true).toDate(),
        location: '#',
        datert: dayjs('01-01-2020').utc(true).toDate(),
        harGyldigSignatur: true,
        innleggelsesperioder: [],
        name: '',
    },
    {
        id: '2',
        type: Dokumenttype.LEGEERKLÆRING,
        mottatt: dayjs('01-01-2020').utc(true).toDate(),
        location: '#',
        datert: dayjs('01-01-2020').utc(true).toDate(),
        harGyldigSignatur: true,
        innleggelsesperioder: [],
        name: '',
    },
];

export default mockedDokumentliste;

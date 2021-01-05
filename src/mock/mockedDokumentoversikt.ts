import dayjs from 'dayjs';
import Dokumentoversikt, { Dokumenttype } from '../types/Dokument';

const mockedDokumentoversikt: Dokumentoversikt = {
    dokumenterMedMedisinskeOpplysninger: [
        {
            id: '2',
            name: 'Dokument 2',
            type: Dokumenttype.LEGEERKLÆRING,
            mottatt: dayjs().toDate(),
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate(),
        },
        {
            id: '3',
            name: 'Dokument 2',
            type: Dokumenttype.LEGEERKLÆRING,
            mottatt: dayjs().toDate(),
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate(),
        },
    ],
    dokumenterUtenMedisinskeOpplysninger: [
        {
            id: '3',
            name: 'Dokument 2',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            mottatt: dayjs().toDate(),
            location: '#blahblah',
        },
    ],
    ustrukturerteDokumenter: [{ id: '1', name: 'Dokument 1', mottatt: dayjs().toDate(), location: '#blahblah' }],
};
export default mockedDokumentoversikt;

import dayjs from 'dayjs';
import { Dokumenttype } from '../../src/types/Dokument';

const mockedDokumentoversikt = {
    dokumenterMedMedisinskeOpplysninger: [
        {
            id: '2',
            name: 'Dokument 2',
            type: Dokumenttype.LEGEERKLÆRING,
            mottatt: dayjs().toDate().toISOString(),
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate().toISOString(),
        },
        {
            id: '3',
            name: 'Dokument 3',
            type: Dokumenttype.LEGEERKLÆRING,
            mottatt: dayjs().toDate().toISOString(),
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate().toISOString(),
        },
    ],
    dokumenterUtenMedisinskeOpplysninger: [
        {
            id: '4',
            name: 'Dokument 4',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            mottatt: dayjs().toDate().toISOString(),
            location: '#blahblah',
        },
    ],
    ustrukturerteDokumenter: [
        { id: '1', name: 'Dokument 1', mottatt: dayjs().toDate().toISOString(), location: '#blahblah' },
    ],
};
export default mockedDokumentoversikt;

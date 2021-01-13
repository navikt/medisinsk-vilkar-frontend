import dayjs from 'dayjs';
import { Dokumenttype } from '../../src/types/Dokument';

const mockedDokumentoversikt = {
    dokumenterMedMedisinskeOpplysninger: [
        {
            id: '2',
            navn: 'Dokument 2',
            type: Dokumenttype.LEGEERKLÆRING,
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate().toISOString(),
        },
        {
            id: '3',
            navn: 'Dokument 3',
            type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
            location: '#blahblah',
            innleggelsesperioder: [],
            harGyldigSignatur: true,
            datert: dayjs().toDate().toISOString(),
        },
    ],
    dokumenterUtenMedisinskeOpplysninger: [
        {
            id: '4',
            navn: 'Dokument 4',
            type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
            datert: dayjs().toDate().toISOString(),
            location: '#blahblah',
        },
    ],
    ustrukturerteDokumenter: [
        { id: '1', navn: 'Dokument 1', datert: dayjs().toDate().toISOString(), location: '#blahblah' },
    ],
};
export default mockedDokumentoversikt;

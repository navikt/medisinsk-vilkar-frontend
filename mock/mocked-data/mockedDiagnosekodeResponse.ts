import LinkRel from '../../src/constants/LinkRel';

export default {
    diagnosekoder: [
        {
            kode: 'hei',
            beskrivelse: 'Diagnosemock',
        },
    ],
    links: [
        {
            rel: LinkRel.ENDRE_DIAGNOSEKODER,
            type: 'POST',
            href: 'http://localhost:8082/mock/endre-diagnosekoder',
            requestPayload: {
                behandlingUuid: 'HER_ER_BEHANDLINGSID',
                versjon: null,
            },
        },
    ],
};

import LinkRel from '../../src/constants/LinkRel';

export default {
    diagnosekoder: [
        {
            kode: 'hei',
            beskrivelse: 'Diagnosemock',
            links: [
                {
                    rel: LinkRel.SLETT_DIAGNOSEKODE,
                    type: 'DELETE',
                    href: 'http://localhost:8082/mock/slett-diagnosekode',
                    requestPayload: {
                        behandlingUuid: 'HER_ER_BEHANDLINGSID',
                        versjon: null,
                    },
                },
            ],
        },
    ],
    links: [
        {
            rel: LinkRel.LEGG_TIL_DIAGNOSEKODE,
            type: 'POST',
            href: 'http://localhost:8082/mock/legg-til-diagnosekode',
            requestPayload: {
                behandlingUuid: 'HER_ER_BEHANDLINGSID',
                versjon: null,
            },
        },
    ],
};

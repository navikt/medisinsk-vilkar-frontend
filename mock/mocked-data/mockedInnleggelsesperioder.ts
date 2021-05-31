import { Period } from '@navikt/k9-period-utils';
import LinkRel from '../../src/constants/LinkRel';

export default {
    perioder: [
        new Period('2021-01-01', '2021-01-15'),
        new Period('2021-01-16', '2021-01-20'),
        new Period('2021-01-21', '2021-01-30'),
    ],
    links: [
        {
            rel: LinkRel.ENDRE_INNLEGGELSESPERIODER,
            type: 'POST',
            href: 'http://localhost:8082/mock/endre-innleggelsesperioder',
            requestPayload: {
                behandlingUuid: 'HER_ER_BEHANDLINGSID',
                versjon: null,
            },
        },
    ],
};

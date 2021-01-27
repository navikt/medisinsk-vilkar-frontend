import Link from '../../src/types/Link';
import LinkRel from '../../src/constants/LinkRel';

const links: Link[] = [
    {
        rel: LinkRel.OPPRETT_VURDERING,
        type: 'POST',
        href: 'http://localhost:8082/mock/opprett-vurdering',
        requestPayload: {
            behandlingUuid: 'mockedUuid',
        },
    },
    {
        rel: LinkRel.DATA_TIL_VURDERING,
        type: 'GET',
        href: 'http://localhost:8082/mock/data-til-vurdering',
    },
];

export default links;

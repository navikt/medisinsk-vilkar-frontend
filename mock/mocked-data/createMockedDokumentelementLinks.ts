import Link from '../../src/types/Link';
import LinkRel from '../../src/constants/LinkRel';

const createMockedDokumentelementLinks = (id: string): Link[] => {
    return [
        {
            rel: LinkRel.ENDRE_DOKUMENT,
            type: 'POST',
            href: `http://localhost:8082/mock/endre-dokument?dokumentId=${id}`,
            versjon: null,
        },
    ];
};

export default createMockedDokumentelementLinks;

import LinkRel from '../constants/LinkRel';

interface Link {
    rel: LinkRel;
    type: 'GET' | 'POST';
    href: string;
    payload?: {
        behandlingUuid: string;
    };
}

export default Link;

import Link from '../../src/types/Link';
import LinkRel from '../../src/constants/LinkRel';

function createMockedVurderingselementLinks(id): Link[] {
    return [
        {
            rel: LinkRel.HENT_VURDERING,
            type: 'GET',
            href: `http://localhost:8082/mock/vurdering?sykdomVurderingId=${id}`,
        },
        {
            rel: LinkRel.ENDRE_VURDERING,
            type: 'POST',
            href: `http://localhost:8082/mock/vurdering?sykdomVurderingId=${id}`,
        },
    ];
}

export default createMockedVurderingselementLinks;

import LinkRel from '../constants/LinkRel';
import Link from '../types/Link';

export const findLinkByRel = (linkRel: LinkRel, links: Link[]) => {
    return links.find(({ rel }) => {
        return rel === linkRel;
    });
};

export const findHrefByRel = (linkRel: LinkRel, links: Link[]) => {
    return findLinkByRel(linkRel, links)?.href;
};

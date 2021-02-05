import { Period } from './Period';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
    perioder: Period[];
    links: Link[];
}

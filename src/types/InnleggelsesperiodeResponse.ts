import { Period } from './Period';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
    behandlingUuid: string;
    versjon: string;
    perioder: Period[];
    links: Link[];
}

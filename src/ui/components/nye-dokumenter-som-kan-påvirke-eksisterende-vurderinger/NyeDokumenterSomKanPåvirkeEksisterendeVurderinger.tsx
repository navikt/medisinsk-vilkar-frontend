import { prettifyDateString } from '@navikt/k9-date-utils';
import { Box, DocumentIcon, Margin } from '@navikt/k9-react-components';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './nyeDokumenterSomKanPåvirkeEksisterendeVurderinger.less';

interface NyeDokumenterListeProps {
    dokumenter: Dokument[];
}

const getDokumentLabel = (type: Dokumenttype) => {
    if (type === Dokumenttype.LEGEERKLÆRING) {
        return 'Legeerklæring';
    }
    if (type === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre medisinske opplysninger';
    }
    return null;
};

const NyeDokumenterListe = ({ dokumenter }: NyeDokumenterListeProps) => (
    <>
        {dokumenter.map((dokument) => {
            const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
            return (
                <p key={dokument.id}>
                    <a
                        href={dokumentLink.href}
                        className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__dokumentLink}
                    >
                        <span className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__ikonContainer}>
                            <DocumentIcon />
                        </span>
                        {`${getDokumentLabel(dokument.type)} (datert ${prettifyDateString(dokument.datert)})`}
                    </a>
                </p>
            );
        })}
    </>
);

interface NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps {
    dokumenter: Dokument[];
}

const NyeDokumenterSomKanPåvirkeEksisterendeVurderinger = ({
    dokumenter,
}: NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps): JSX.Element => (
    <Box marginTop={Margin.large} marginBottom={Margin.large}>
        <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger}>
            <Box marginTop={Margin.large}>
                <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__content}>
                    <Element>Nye dokumenter på barnet:</Element>
                    <NyeDokumenterListe dokumenter={dokumenter} />
                </div>
            </Box>
        </div>
    </Box>
);

export default NyeDokumenterSomKanPåvirkeEksisterendeVurderinger;

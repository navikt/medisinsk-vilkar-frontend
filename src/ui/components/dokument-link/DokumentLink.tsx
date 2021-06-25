import { ContentWithTooltip, DocumentIcon, OnePersonOutlineGray } from '@navikt/k9-react-components';
import { prettifyDateString } from '@navikt/k9-date-utils';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './dokumentLink.less';

interface DokumentLinkProps {
    dokument: Dokument;
    etikett?: string;
    visDokumentIkon?: boolean;
}

const renderDokumenttypeText = (dokumenttype: Dokumenttype) => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return 'Sykehus/spesialist.';
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre med. oppl.';
    }
    return null;
};

const DokumentLink = ({ dokument, etikett, visDokumentIkon }: DokumentLinkProps): JSX.Element => {
    const { type, datert, links } = dokument;
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
    return (
        <Lenke className={styles.dokumentLink} href={dokumentLink.href} target="_blank">
            {visDokumentIkon && <DocumentIcon className={styles.dokumentLink__dokumentikon} />}
            {renderDokumenttypeText(type)} {prettifyDateString(datert)}
            <div className={styles.dokumentLink__etikett}>
                {etikett && (
                    <ContentWithTooltip tooltipText={etikett} tooltipDirectionRight>
                        <OnePersonOutlineGray />
                    </ContentWithTooltip>
                )}
            </div>
        </Lenke>
    );
};

export default DokumentLink;

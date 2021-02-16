import React from 'react';
import Lenke from 'nav-frontend-lenker';
import dayjs from 'dayjs';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import OnePersonOutline from '../icons/OnePersonOutline';
import styles from './dokumentLink.less';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';

interface DokumentLinkProps {
    dokument: Dokument;
    etikett?: string;
}

const renderDokumenttypeText = (dokumenttype: Dokumenttype) => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return 'Sykehus/spesialist.';
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre med. oppl.';
    }
};

const DokumentLink = ({ dokument, etikett }: DokumentLinkProps) => {
    const { type, datert, links } = dokument;
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
    return (
        <Lenke className={styles.dokumentLink} href={dokumentLink.href} target="_blank">
            {renderDokumenttypeText(type)} {prettifyDate(dayjs(datert).utc(true).toISOString())}
            <div className={styles.dokumentLink__etikett}>
                {etikett && (
                    <ContentWithTooltip tooltipText={etikett} tooltipDirectionRight>
                        <OnePersonOutline />
                    </ContentWithTooltip>
                )}
            </div>
        </Lenke>
    );
};

export default DokumentLink;

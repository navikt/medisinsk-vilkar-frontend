import Lenke from 'nav-frontend-lenker';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';
import { findLinkByRel } from '../../../util/linkUtils';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import DocumentIcon from '../icons/DocumentIcon';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import OnePersonIconBlue from '../icons/OnePersonIconBlue';
import OnePersonOutline from '../icons/OnePersonOutline';
import styles from './strukturertDokumentElement.less';

interface StrukturertDokumentElementProps {
    dokument: Dokument;
}

const StrukturertDokumentElement = ({
    dokument: { navn, datert, type, links, annenPartErKilde },
}: StrukturertDokumentElementProps): JSX.Element => {
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);

    const getDokumenttype = () => {
        if (type === Dokumenttype.LEGEERKLÆRING) {
            return 'Sykehus/spesialist.';
        }
        if (type === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
            return 'Andre med. oppl.';
        }
        if (type === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
            return 'Ikke med. oppl.';
        }
        return navn;
    };

    const parterLabel = () => {
        if (annenPartErKilde) {
            return (
                <ContentWithTooltip tooltipText="Annen part" inline>
                    <OnePersonOutline />
                </ContentWithTooltip>
            );
        }
        return (
            <ContentWithTooltip tooltipText="Søker" inline>
                <OnePersonIconBlue />
            </ContentWithTooltip>
        );
    };

    return (
        <div className={styles.strukturertDokumentElement}>
            <span className={styles.visuallyHidden}>Status</span>
            <GreenCheckIconFilled />
            <div className={styles.strukturertDokumentElement__texts}>
                <span className={styles.strukturertDokumentElement__texts__type}>
                    <span className={styles.visuallyHidden}>Type</span>
                    {getDokumenttype()}
                </span>
                <span className={styles.strukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    {prettifyDate(datert)}
                </span>
                <span className={styles.strukturertDokumentElement__texts__part}>
                    <span className={styles.visuallyHidden}>Part</span>
                    {parterLabel()}
                </span>
                <span className={styles.strukturertDokumentElement__texts__document}>
                    <ContentWithTooltip tooltipText="Åpne dokument i ny fane">
                        <Lenke
                            href={dokumentLink.href}
                            target="_blank"
                            onClick={(event) => event.stopPropagation()}
                            ariaLabel="Åpne dokument"
                        >
                            <DocumentIcon />
                        </Lenke>
                    </ContentWithTooltip>
                </span>
            </div>
        </div>
    );
};

export default StrukturertDokumentElement;

import React from 'react';
import { Dokument } from '../../../types/Dokument';
import WarningIcon from '../icons/WarningIcon';
import styles from './ustrukturertDokumentElement.less';
import { prettifyDate } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import OnePersonIconBlue from '../icons/OnePersonIconBlue';
import OnePersonOutline from '../icons/OnePersonOutline';
import Lenke from 'nav-frontend-lenker';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import DocumentIcon from '../icons/DocumentIcon';

interface UstrukturertDokumentElementProps {
    dokument: Dokument;
}

const UstrukturertDokumentElement = ({
    dokument: { datert, annenPartErKilde, links },
}: UstrukturertDokumentElementProps) => {
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);

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
        <div className={styles.ustrukturertDokumentElement}>
            <ContentWithTooltip tooltipText="Dokumentet må håndteres">
                <WarningIcon />
            </ContentWithTooltip>
            <div className={styles.ustrukturertDokumentElement__texts}>
                <span className={styles.ustrukturertDokumentElement__texts__type}>
                    <span className={styles.visuallyHidden}>Type</span>
                    Ikke klassifisert
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    <ContentWithTooltip inline tooltipText="Dato dokumentet ble mottatt">
                        {`${prettifyDate(datert)}*`}
                    </ContentWithTooltip>
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__part}>
                    <span className={styles.visuallyHidden}>Part</span>
                    {parterLabel()}
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__document}>
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

export default UstrukturertDokumentElement;

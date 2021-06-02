import { ContentWithTooltip } from '@navikt/k9-react-components';
import { prettifyDateString } from '@navikt/k9-date-utils';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import { Dokument } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import DocumentIcon from '../icons/DocumentIcon';
import OnePersonIconGray from '../icons/OnePersonIconGray';
import OnePersonOutlineGray from '../icons/OnePersonOutlineGray';
import WarningIcon from '../icons/WarningIcon';
import styles from './ustrukturertDokumentElement.less';

interface UstrukturertDokumentElementProps {
    dokument: Dokument;
}

const UstrukturertDokumentElement = ({
    dokument: { datert, mottattDato, annenPartErKilde, links },
}: UstrukturertDokumentElementProps) => {
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);

    const parterLabel = () => {
        if (annenPartErKilde) {
            return (
                <ContentWithTooltip tooltipText="Annen part" inline>
                    <OnePersonOutlineGray />
                </ContentWithTooltip>
            );
        }
        return (
            <ContentWithTooltip tooltipText="Søker" inline>
                <OnePersonIconGray />
            </ContentWithTooltip>
        );
    };

    return (
        <div className={styles.ustrukturertDokumentElement}>
            <ContentWithTooltip tooltipText="Dokumentet må håndteres">
                <WarningIcon />
            </ContentWithTooltip>
            <div className={styles.ustrukturertDokumentElement__texts}>
                <p className={styles.ustrukturertDokumentElement__texts__type} id="ikkeKlassifisertText">
                    <span className={styles.visuallyHidden}>Type</span>
                    Ikke klassifisert
                </p>
                <span className={styles.ustrukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    <ContentWithTooltip inline tooltipText="Dato dokumentet ble mottatt">
                        {`${prettifyDateString(datert || mottattDato)}*`}
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

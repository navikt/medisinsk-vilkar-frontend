import {
    ContentWithTooltip,
    DocumentIcon,
    GreenCheckIconFilled,
    OnePersonIconGray,
    OnePersonOutlineGray,
} from '@navikt/k9-react-components';
import { prettifyDateString } from '@navikt/k9-date-utils';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
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
        <div className={styles.strukturertDokumentElement}>
            <span className={styles.visuallyHidden}>Status</span>
            <ContentWithTooltip tooltipText="Dokumentet er ferdig håndtert">
                <GreenCheckIconFilled />
            </ContentWithTooltip>
            <div className={styles.strukturertDokumentElement__texts}>
                <p className={styles.strukturertDokumentElement__texts__type}>
                    <span className={styles.visuallyHidden}>Type</span>
                    {getDokumenttype()}
                </p>
                <span className={styles.strukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    {prettifyDateString(datert)}
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

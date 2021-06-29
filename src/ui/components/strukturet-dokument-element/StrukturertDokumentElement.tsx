import { prettifyDateString } from '@navikt/k9-date-utils';
import {
    ContentWithTooltip,
    GreenCheckIconFilled,
    OnePersonIconGray,
    OnePersonOutlineGray,
} from '@navikt/k9-react-components';
import React from 'react';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import styles from './strukturertDokumentElement.less';

interface StrukturertDokumentElementProps {
    dokument: Dokument;
}

const StrukturertDokumentElement = ({
    dokument: { navn, datert, type, annenPartErKilde, duplikater },
}: StrukturertDokumentElementProps): JSX.Element => {
    const harDuplikater = duplikater?.length > 0;

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
                {harDuplikater && (
                    <span className={styles.strukturertDokumentElement__texts__document}>
                        <ContentWithTooltip tooltipText="Det finnes ett eller flere duplikater av dette dokumentet">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.5 4.875L16.5 17.625C16.5 17.8328 16.332 18 16.125 18L7.875 18C7.66725 18 7.5 17.8327 7.5 17.625L7.5 4.875L7.5 4.5L7.875 4.5L16.125 4.5C16.332 4.5 16.5 4.66875 16.5 4.875ZM7.125 3.75L13.5 3.75L13.5 2.625C13.5 2.41875 13.332 2.25 13.125 2.25L4.875 2.25L4.5 2.25L4.5 2.625L4.5 15.375C4.5 15.5827 4.66725 15.75 4.875 15.75L6.75 15.75L6.75 4.125C6.75 3.91875 6.91725 3.75 7.125 3.75ZM4.125 1.5L10.5 1.5L10.5 0.375C10.5 0.16875 10.332 -2.69612e-07 10.125 -2.7866e-07L1.875 -6.39279e-07C1.66725 -6.4836e-07 1.5 0.168749 1.5 0.374999L1.5 13.125C1.5 13.3327 1.66725 13.5 1.875 13.5L3.75 13.5L3.75 1.875C3.75 1.66875 3.91725 1.5 4.125 1.5Z"
                                    fill="#3E3832"
                                />
                            </svg>
                        </ContentWithTooltip>
                    </span>
                )}
            </div>
        </div>
    );
};

export default StrukturertDokumentElement;

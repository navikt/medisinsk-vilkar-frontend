import React from 'react';
import { Dokument } from '../../../types/Dokument';
import WarningIcon from '../icons/WarningIcon';
import styles from './ustrukturertDokumentElement.less';
import { prettifyDate } from '../../../util/formats';
import IconWithTooltip from '../content-with-tooltip/ContentWithTooltip';

interface UstrukturertDokumentElementProps {
    dokument: Dokument;
}

const UstrukturertDokumentElement = ({ dokument: { datert } }: UstrukturertDokumentElementProps) => {
    return (
        <div className={styles.ustrukturertDokumentElement}>
            <WarningIcon />
            <div className={styles.ustrukturertDokumentElement__texts}>
                <span className={styles.ustrukturertDokumentElement__texts__type}>
                    <span className={styles.visuallyHidden}>Type</span>
                    Ikke klassifisert
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    <IconWithTooltip inline tooltipText="Dato dokumentet ble mottatt">
                        {`${prettifyDate(datert)}*`}
                    </IconWithTooltip>
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__status}>
                    <span className={styles.visuallyHidden}>Status</span>
                    Ikke håndtert
                </span>
            </div>
        </div>
    );
};

export default UstrukturertDokumentElement;

import React from 'react';
import { Dokument } from '../../../types/Dokument';
import WarningIcon from '../icons/WarningIcon';
import styles from './ustrukturertDokumentElement.less';
import { prettifyDate } from '../../../util/formats';

interface UstrukturertDokumentElementProps {
    dokument: Dokument;
}

const UstrukturertDokumentElement = ({ dokument: { navn, datert } }: UstrukturertDokumentElementProps) => {
    return (
        <div className={styles.ustrukturertDokumentElement}>
            <WarningIcon />
            <div className={styles.ustrukturertDokumentElement__texts}>
                <span>{navn}</span>
                <span className={styles.ustrukturertDokumentElement__texts__date}>{prettifyDate(datert)}</span>
                <span className={styles.ustrukturertDokumentElement__texts__status}>Ikke håndtert</span>
            </div>
        </div>
    );
};

export default UstrukturertDokumentElement;

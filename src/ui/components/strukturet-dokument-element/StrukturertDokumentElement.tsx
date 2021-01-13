import React from 'react';
import { StrukturertDokument } from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import styles from './strukturertDokumentElement.less';

interface StrukturertDokumentElementProps {
    dokument: StrukturertDokument;
}

const StrukturertDokumentElement = ({ dokument: { navn, datert } }: StrukturertDokumentElementProps) => {
    return (
        <div className={styles.strukturertDokumentElement}>
            <GreenCheckIconFilled />
            <div className={styles.strukturertDokumentElement__texts}>
                <span>{navn}</span>
                <span className={styles.strukturertDokumentElement__texts__date}>{prettifyDate(datert)}</span>
                <span className={styles.strukturertDokumentElement__texts__status}>Ferdig håndtert</span>
            </div>
        </div>
    );
};

export default StrukturertDokumentElement;

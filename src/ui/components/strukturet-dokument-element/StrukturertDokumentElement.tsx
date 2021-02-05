import React from 'react';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import styles from './strukturertDokumentElement.less';

interface StrukturertDokumentElementProps {
    dokument: Dokument;
}

const StrukturertDokumentElement = ({
    dokument: { navn, datert, type },
}: StrukturertDokumentElementProps): JSX.Element => {
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

    return (
        <div className={styles.strukturertDokumentElement}>
            <GreenCheckIconFilled />
            <div className={styles.strukturertDokumentElement__texts}>
                <span className={styles.strukturertDokumentElement__texts__type}>{getDokumenttype()}</span>
                <span className={styles.strukturertDokumentElement__texts__date}>{prettifyDate(datert)}</span>
                <span className={styles.strukturertDokumentElement__texts__status}>Ferdig håndtert</span>
            </div>
        </div>
    );
};

export default StrukturertDokumentElement;

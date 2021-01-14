import React from 'react';
import Innleggelsesperiodeoversikt from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import Diagnosekodeoversikt from '../diagnosekodeoversikt/Diagnosekodeoversikt';
import styles from './dokumentasjonFooter.less';

const DokumentasjonFooter = () => {
    return (
        <div className={styles.dokumentasjonFooter}>
            <div className={styles.dokumentasjonFooter__leftSection}>
                <Innleggelsesperiodeoversikt />
            </div>
            <div className={styles.dokumentasjonFooter__rightSection}>
                <Diagnosekodeoversikt />
            </div>
        </div>
    );
};

export default DokumentasjonFooter;

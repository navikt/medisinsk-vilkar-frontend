import React from 'react';
import Innleggelsesperiodeoversikt from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import Diagnosekodeoversikt from '../diagnosekodeoversikt/Diagnosekodeoversikt';
import SignertSeksjon from '../signert-seksjon/SignertSeksjon';
import styles from './dokumentasjonFooter.less';

const DokumentasjonFooter = () => {
    return (
        <div className={styles.dokumentasjonFooter}>
            <div className={styles.dokumentasjonFooter__firstSection}>
                <Innleggelsesperiodeoversikt />
            </div>
            <div className={styles.dokumentasjonFooter__secondSection}>
                <Diagnosekodeoversikt />
            </div>
            <div className={styles.dokumentasjonFooter__thirdSection}>
                <SignertSeksjon harGyldigSignatur={false} />
            </div>
        </div>
    );
};

export default DokumentasjonFooter;

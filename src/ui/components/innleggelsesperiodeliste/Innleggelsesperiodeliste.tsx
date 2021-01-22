import React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import styles from './innleggelsesperiodeliste.less';

interface InnleggelsesperiodelisteProps {
    innleggelsesperioder: Period[];
}

const Innleggelsesperiodeliste = ({ innleggelsesperioder }: InnleggelsesperiodelisteProps) => {
    return (
        <ul className={styles.innleggelsesperiodeliste}>
            {innleggelsesperioder.map((innleggelsesperiode) => {
                const { fom, tom } = innleggelsesperiode;
                return (
                    <li key={`${fom}${tom}`} className={styles.innleggelsesperiodeliste__element}>
                        {prettifyPeriod(innleggelsesperiode)}
                    </li>
                );
            })}
        </ul>
    );
};

export default Innleggelsesperiodeliste;
